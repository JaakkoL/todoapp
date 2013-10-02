# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.10)
# Database: todoapp
# Generation Time: 2013-10-01 20:55:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table access
# ------------------------------------------------------------

CREATE TABLE `access` (
  `uid` int(11) unsigned NOT NULL COMMENT 'Users id.',
  `listId` int(11) NOT NULL COMMENT 'Lists is.',
  `role` varchar(50) NOT NULL DEFAULT '' COMMENT 'Access role, owner or contributor.',
  KEY `uid` (`uid`),
  KEY `lid` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table category
# ------------------------------------------------------------

CREATE TABLE `category` (
  `categoryId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Category id.',
  `parent` int(11) DEFAULT NULL COMMENT 'Category parent item id.',
  `name` varchar(255) DEFAULT NULL COMMENT 'Category name.',
  `uid` int(11) NOT NULL COMMENT 'Creator user id.',
  PRIMARY KEY (`categoryId`),
  KEY `parent` (`parent`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table list
# ------------------------------------------------------------

CREATE TABLE `list` (
  `listId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'List unique id.',
  `categoryId` int(11) DEFAULT NULL COMMENT 'Category id where this list belongs to.',
  `name` varchar(255) DEFAULT NULL COMMENT 'List name.',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'List creation time.',
  `edited` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when list was last modified.',
  PRIMARY KEY (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table session
# ------------------------------------------------------------

CREATE TABLE `session` (
  `uid` int(11) DEFAULT NULL COMMENT 'Session users id.',
  `sessionId` varchar(255) DEFAULT NULL COMMENT 'Session id string.',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp.',
  UNIQUE KEY `sessionid` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table task
# ------------------------------------------------------------

CREATE TABLE `task` (
  `taskId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Task id.',
  `listId` int(11) DEFAULT NULL COMMENT 'Associated list id.',
  `creator` int(11) DEFAULT NULL COMMENT 'Creator of the task',
  `editedby` int(11) DEFAULT NULL COMMENT 'User who last edited the item.',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Task creation timestamp',
  `modified` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when task was last modified.',
  `status` int(1) DEFAULT '0' COMMENT 'Tasks status.',
  `text` varchar(255) DEFAULT NULL COMMENT 'Task contents.',
  PRIMARY KEY (`taskId`),
  KEY `lid` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

CREATE TABLE `user` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique user id',
  `email` varchar(80) NOT NULL DEFAULT '' COMMENT 'Users unique email',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT 'Password hash',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when usr was created.',
  `lastlogin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Timestamp when user last logged in the app.',
  `firstname` varchar(100) DEFAULT NULL COMMENT 'Users first name',
  `lastname` varchar(100) DEFAULT NULL COMMENT 'Users last name',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
