--
-- 由SQLiteStudio v3.1.1 产生的文件 周六 3月 4 01:05:21 2017
--
-- Text encoding：UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- table：t_attach
DROP TABLE IF EXISTS t_attach;
CREATE TABLE t_attach (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, fname VARCHAR (100) NOT NULL, ftype VARCHAR (50), fkey VARCHAR (100) NOT NULL, author_id INTEGER (10) NOT NULL, created INTEGER (10) NOT NULL);

-- table：t_comments
DROP TABLE IF EXISTS t_comments;
CREATE TABLE t_comments (coid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, cid INTEGER DEFAULT (0) NOT NULL, created INTEGER (10) NOT NULL, author VARCHAR (200) NOT NULL, author_id INTEGER (10) DEFAULT (0), owner_id INTEGER (10) DEFAULT (0), mail VARCHAR (200) NOT NULL, url VARCHAR (200), ip VARCHAR (64), agent VARCHAR (200), content TEXT NOT NULL, type VARCHAR (16), status VARCHAR (16), parent INTEGER (10) DEFAULT (0));

-- table：t_contents
DROP TABLE IF EXISTS t_contents;

CREATE TABLE t_contents ( cid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, title VARCHAR (255) NOT NULL, slug VARCHAR (255) CONSTRAINT idx_u_slug UNIQUE, thumb_img VARCHAR(255), created INTEGER (10) NOT NULL, modified INTEGER (10), content TEXT, author_id INTEGER (10) NOT NULL, type VARCHAR (16) NOT NULL, status VARCHAR (16) NOT NULL, fmt_type VARCHAR (16) DEFAULT ('markdown'), tags VARCHAR (200), categories VARCHAR (200), hits INTEGER (10) DEFAULT (0), comments_num INTEGER (1) DEFAULT (0), allow_comment INTEGER (1) DEFAULT (1), allow_ping INTEGER (1), allow_feed INTEGER (1) );
INSERT INTO t_contents (cid, title, slug, created, modified, content, author_id, type, status, tags, categories, hits, comments_num, allow_comment, allow_ping, allow_feed) VALUES (1, 'on', 'about', 1487853610, 1487872488, '### Hello World

This is my page about

### Of course there are others

Specifically, what do you write?', 1, 'page', 'publish', NULL, NULL, 0, 0, 1, 1, 1);
INSERT INTO t_contents (cid, title, slug, created, modified, content, author_id, type, status, tags, categories, hits, comments_num, allow_comment, allow_ping, allow_feed) VALUES (2, 'First article', NULL, 1487861184, 1487872798, '## Hello  World.

> What should I write about the first article?...

----------


<!--more-->

```java
public static void main(String[] args){
    System.out.println(\"Hello Tale.\");
}
```', 1, 'post', 'publish', '', 'default category', 10, 0, 1, 1, 1);

INSERT INTO t_contents (allow_feed,allow_ping,allow_comment,comments_num,hits,
categories,tags,fmt_type,status,type,author_id,content,modified,created,thumb_img,slug,title,cid) VALUES (
NULL,1,1,0,0,NULL,NULL,'markdown','publish','page',1,'## Links

- :lock: [Wang Jues technology blog]()
- :lock: [cyang.tech]()
- :lock: [Bakumons Blog]()

## Link notice

> Please make sure your station can operate stably
> Original blog priority, technical blog priority, design, visual blog priority
> Frequently come to visit and comment, familiar

Note: The default application link is the inner page (current page)

## Basic Information

                Website Name: Tale Blog
                Website address：https://tale.biezhi.me

Please apply for a friends chain through comments on the page, and dont reply in other places.

For the time being, please welcome the exchange of friends, this page can be message。 ^_^

Also, I will occasionally clean up unreachable URLs, please ensure that their links are valid for a long time.。',1505643888,1505643727,NULL,'links','Links',3);

-- table：t_logs
DROP TABLE IF EXISTS t_logs;
CREATE TABLE t_logs (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, "action" VARCHAR (100) NOT NULL, data VARCHAR (2000), author_id INTEGER (10) NOT NULL, ip VARCHAR (20), created INTEGER (10) NOT NULL);

-- table：t_metas
DROP TABLE IF EXISTS t_metas;
CREATE TABLE t_metas (mid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, name VARCHAR (200) NOT NULL, slug VARCHAR (200), type VARCHAR (32) NOT NULL, description VARCHAR (255), sort INTEGER (4) DEFAULT (0), parent INTEGER (10) DEFAULT (0));
INSERT INTO t_metas (mid, name, slug, type, description, sort, parent) VALUES (1, 'default category', NULL, 'category', NULL, 0, 0);

-- table：t_options
DROP TABLE IF EXISTS t_options;
CREATE TABLE t_options (name VARCHAR (100) PRIMARY KEY UNIQUE NOT NULL, value TEXT, description VARCHAR (255));
INSERT INTO t_options (name, value, description) VALUES ('site_title', 'Tale blog system', '');
INSERT INTO t_options (name, value, description) VALUES ('social_weibo', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_zhihu', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_github', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_twitter', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('allow_install', 'false', 'Whether to allow reinstallation of the blog');
INSERT INTO t_options (name, value, description) VALUES ('allow_comment_audit', 'true', 'Comments need to be reviewed');
INSERT INTO t_options (name, value, description) VALUES ('site_theme', 'default', NULL);
INSERT INTO t_options (name, value, description) VALUES ('site_keywords', 'Blog system, Blade framework, Tale', NULL);
INSERT INTO t_options (name, value, description) VALUES ('site_description', 'Blog system, Blade framework, Tale', NULL);

-- table：t_relationships
DROP TABLE IF EXISTS t_relationships;
CREATE TABLE t_relationships (cid INTEGER (10) NOT NULL, mid INTEGER (10) NOT NULL);

INSERT INTO t_relationships(cid, mid) VALUES(2, 1);

-- table：t_users
DROP TABLE IF EXISTS t_users;
CREATE TABLE t_users (uid INTEGER PRIMARY KEY UNIQUE NOT NULL, username VARCHAR (64) UNIQUE NOT NULL, password VARCHAR (64) NOT NULL, email VARCHAR (100), home_url VARCHAR (255), screen_name VARCHAR (100), created INTEGER (10) NOT NULL, activated INTEGER (10), logged INTEGER (10), group_name VARCHAR (16));

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;

