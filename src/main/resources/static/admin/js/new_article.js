var mditor, htmlEditor;
var tale = new $.tale();
var attach_url = $('#attach_url').val();
// 每60秒自动保存一次草稿
var refreshIntervalId;
Dropzone.autoDiscover = false;
Vue.component('v-select', VueSelect.VueSelect);

var vm = new Vue({
    el: '#app',
    data: {
        article: {
            cid: '',
            title: '',
            slug: '',
            tags: '',
            content: '',
            status: 'draft',
            fmtType: 'markdown',
            thumbImg: '',
            allowComment: true,
            allowPing: true,
            allowFeed: true,
            created: moment().unix(),
            createdTime: moment().format('YYYY-MM-DD HH:mm'),
            selected: ['default category']
        },
        categories: [],
        isLoading: true
    },
    beforeCreate: function(){
        vueLoding = this.$loading.show();
    },
    mounted: function () {
        var $vm = this;
        $vm.load();
        refreshIntervalId = setInterval("vm.autoSave()", 10 * 1000);
    },
    methods: {
        load: function () {
            var $vm = this;
            tale.get({
                url: '/admin/api/categories',
                success: function (data) {
                    for(item in data.payload){
                        $vm.categories.push(data.payload[item].name);
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(result.msg || 'Data loading failed');
                }
            });
        },
        autoSave: function (callback) {
            var $vm = this;
            var content = $vm.article.fmtType === 'markdown' ? mditor.value : htmlEditor.summernote('code');
            if ($vm.article.title !== '' && content !== '') {

                $vm.article.content = content;
                $vm.article.categories = $vm.article.selected.join(',');

                var params = tale.copy($vm.article);
                params.selected = null;
                params.created = moment($('#form_datetime').val(), "YYYY-MM-DD HH:mm").unix();
                params.tags = $('#tags').val();

                var url = $vm.article.cid !== '' ? '/admin/api/article/update' : '/admin/api/article/new';
                tale.post({
                    url: url,
                    data: params,
                    success: function (result) {
                        if (result && result.success) {
                            $vm.article.cid = result.payload;
                            callback && callback();
                        } else {
                            tale.alertError(result.msg || 'Save article failed');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                        clearInterval(refreshIntervalId);
                    }
                });
            }
        },
        switchEditor: function (event) {
            var type = this.article.fmtType;
            var this_ = event.target;
            if (type === 'markdown') {
                // 切换为富文本编辑器
                if ($('#md-container .markdown-body').html().length > 0) {
                    $('#html-container .note-editable').empty().html($('#md-container .markdown-body').html());
                    $('#html-container .note-placeholder').hide();
                }
                mditor.value = '';
                $('#md-container').hide();
                $('#html-container').show();

                this_.innerHTML = 'Switch to Markdown Editor';

                this.article.fmtType = 'html';
            } else {
                // 切换为markdown编辑器
                if ($('#html-container .note-editable').html().length > 0) {
                    mditor.value = '';
                    mditor.value = toMarkdown($('#html-container .note-editable').html());
                }
                $('#html-container').hide();
                $('#md-container').show();

                this.article.fmtType = 'markdown';

                this_.innerHTML = 'Switch to rich text editor';
                htmlEditor.summernote("code", "");
            }
        },
        publish: function (status) {
            var $vm = this;
            var content = this.article.fmtType === 'markdown' ? mditor.value : htmlEditor.summernote('code');
            var title = $vm.article.title;
            if (title === '') {
                tale.alertWarn('Please enter the title of the article');
                return;
            }
            if (content === '') {
                tale.alertWarn('Please enter the content of the article');
                return;
            }
            clearInterval(refreshIntervalId);
            $vm.article.status  = status;

            $vm.autoSave(function () {
                tale.alertOk({
                    text: 'The article was published successfully',
                    then: function () {
                        setTimeout(function () {
                            window.location.href = '/admin/articles';
                        }, 500);
                    }
                });
            });
        }
    }
});

$(document).ready(function () {

    $("#form_datetime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        todayBtn: true,
        weekStart: 1,
        language: 'en-EN'
    });

    mditor = window.mditor = Mditor.fromTextarea(document.getElementById('md-editor'));
    // 富文本编辑器
    htmlEditor = $('.summernote').summernote({
        lang: 'en-EN',
        height: 340,
        placeholder: 'Write something...',
        //上传图片的接口
        callbacks: {
            onImageUpload: function (files) {
                var data = new FormData();
                data.append('image_up', files[0]);
                tale.showLoading();
                $.ajax({
                    url: '/admin/api/attach/upload',
                    method: 'POST',
                    data: data,
                    processData: false,
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': document.head.querySelector("[name=csrf_token]").content
                    },
                    contentType: false,
                    success: function (result) {
                        tale.hideLoading();
                        if (result && result.success) {
                            var url = $('#attach_url').val() + result.payload[0].fkey;
                            console.log('url =>' + url);
                            htmlEditor.summernote('insertImage', url);
                        } else {
                            tale.alertError(result.msg || 'Image upload failed');
                        }
                    }
                });
            }
        }
    });

    // Tags Input
    $('#tags').tagsInput({
        width: '100%',
        height: '35px',
        defaultText: 'Please enter the article label'
    });

    $('#allowComment').toggles({
        on: true,
        text: {
            on: 'On',
            off: 'Off'
        }
    });

    $('#allowPing').toggles({
        on: true,
        text: {
            on: 'On',
            off: 'Off'
        }
    });

    $('#allowFeed').toggles({
        on: true,
        text: {
            on: 'On',
            off: 'Off'
        }
    });

    $('#addThumb').toggles({
        on: false,
        text: {
            on: 'On',
            off: 'Off'
        }
    });

    $('#allowComment').on('toggle', function (e, active) {
        vm.article.allowComment = active;
    });

    $('#allowPing').on('toggle', function (e, active) {
        vm.article.allowPing = active;
    });

    $('#allowFeed').on('toggle', function (e, active) {
        vm.article.allowFeed = active;
    });

    $('#addThumb').on('toggle', function (e, active) {
        if (active) {
            $('#dropzone-container').removeClass('hide');
            $('#dropzone-container').show();
            var thumbImage = $("#dropzone").css("backgroundImage");
            if(thumbImage && thumbImage.indexOf('url') !== -1){
                thumbImage = thumbImage.split("(")[1].split(")")[0];
                vm.article.thumbImg = thumbImage.substring(1, thumbImage.length - 1);
            }
        } else {
            $('#dropzone-container').addClass('hide');
            vm.article.thumbImg = '';
        }
    });

    var thumbdropzone = $('.dropzone');

    // 缩略图上传
    $("#dropzone").dropzone({
        url: "/admin/api/attach/upload",
        filesizeBase: 1024,//Define Byte Algorithm Default 1000
        maxFilesize: '10', //MB
        fallback: function () {
            tale.alertError('Your browser upload is not supported yet!');
        },
        acceptedFiles: 'image/*',
        dictFileTooBig: 'Your file is over 10MB!',
        dictInvalidInputType: 'The type you uploaded is not supported',
        headers: {
            'X-CSRF-TOKEN': document.head.querySelector("[name=csrf_token]").content
        },
        init: function () {
            this.on('success', function (files, result) {
                console.log("upload success..");
                console.log(" result => " + result);
                if (result && result.success) {
                    var url = attach_url + result.payload[0].fkey;
                    console.log('url => ' + url);

                    vm.article.thumbImg = url;
                    thumbdropzone.css('background-image', 'url(' + url + ')');
                    thumbdropzone.css('background-size', 'cover');
                    $('.dz-image').hide();
                }
            });
            this.on('error', function (a, errorMessage, result) {
                if (!result.success && result.msg) {
                    tale.alertError(result.msg || 'Thumbnail upload failed');
                }
            });
        }
    });

    vm.isLoading = false;
    vueLoding.hide();
});
