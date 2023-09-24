-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: topic
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `likes` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `user_data` json DEFAULT NULL,
  `create_at` datetime DEFAULT NULL COMMENT 'Create Time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (4,'Schrodinger cat','No se si vivir o morir',3,1,NULL,'2023-09-12 19:40:15'),(5,'Lorem ipsum','Lorem ipsum dolor',10,1,NULL,'2023-09-12 19:41:48'),(6,'Testing de fecha','Esto es para ver si se ordenan por fecha.',0,1,NULL,'2023-09-12 19:46:29'),(7,'Otra prueba mas','Con suerte la final',5,1,NULL,'2023-09-12 19:49:08'),(8,'Ultima','ultima ultima',0,1,NULL,'2023-09-12 19:52:29'),(20,'Hola','Soy Superman',6,18,NULL,'2023-09-12 21:26:53'),(21,'Perrito malvado','Agarras carabana, volves re mamado.',9,37,NULL,'2023-09-12 21:39:08'),(22,'Reaccion Redox','Las reacciones redox son como las milanesas.',10,4,NULL,'2023-09-12 22:43:01'),(23,'Texto','mucho texto',5,1,NULL,'2023-09-13 10:51:47'),(25,'Emoji test','El Inter Miami es lo mejor ­ƒÿè',2,34,NULL,'2023-09-13 13:10:08'),(26,'Argentina campeon!','Tenemos la copa gente!! ­ƒÅå­ƒÑ│­ƒÑ│',1,34,NULL,'2023-09-13 13:11:18'),(27,'Alejense de mi pantano!','­ƒÿá­ƒÿá­ƒÿí',4,26,NULL,'2023-09-13 20:58:42'),(28,'El tio Ben decia','Un gran poder, conlleva una gran responsabilidad ­ƒò©´©Å­ƒò©´©Å',5,27,NULL,'2023-09-15 22:42:57');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(150) DEFAULT NULL,
  `lname` varchar(150) DEFAULT NULL,
  `uname` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(150) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Agustin','Monta├▒a','Agustinm28','agustinm28@gmail.com','sha256$jYQinObQpmaBHdn2$c70a8eff89bac5bdc6dc89f637114b3879ee2b2ceb182d33b2552623ce360070',1),(2,'Mauro','Sarmiento','Maurinho','mauro.sarmiento@gmail.com','sha256$u2TO1iamHpeI7aN3$78692d062cd1aa492922eaacbff1239e5f31ec84e91e196dbd18a198b4e1ad76',0),(4,'Lucila','Gutierrez','LuGuti','lu.gutierrez@gmail.com','sha256$VDmf4FlrTwdFx0J2$6633cbdfb964b1434878bdc28fbc34f1b03c03ae8b67bfe1ddc1005c84a74093',0),(17,'Bruno','Orbelli','Brunengo','bruno.orbelli@gmail.com','sha256$AUynz0qHRZUscc31$9c823d71ee374fdfe9c89ebfbfc2687f810ef742f5d0cb43d57827001ea306a0',0),(18,'Henry','Cavill','HCavill10','h.cavill@gmail.com','sha256$EZhLK8cRzZpHr0r3$ca9e777caf98b8ca3b38ed950649f49081fa8768aa287a232d78f700431c9c03',1),(21,'Bruce','Wayne','IAmBatman','brucewayne@gmail.com','sha256$UZHzj10Ox9ItNonw$a703f1c0e2430de8e120843a1443cedfd5fee1d18bf440475afc06cbc2661ccb',0),(25,'Dua','Lipa','DuaLipa','d.lipa@gmail.com','sha256$aUE5yTmFtNKx90Vi$9bf199990c0b8c60da1f679161a8ba15b5b9adc3c10fc2ef4e1d4d64f15e1428',0),(26,'Shrek','Ogre','Shrek','shrek@gmail.com','sha256$xRJDj4OxwGO3Ldij$bfc21025f291f1d3497b2ed22fe236449cf388d8ff3d24a4f05f57b886033b93',0),(27,'Peter','Parker','Spiderman','p.parker@gmail.com','sha256$B3UYtK74pVduJJX9$a3050b68e4cbd1eb789d734ed167c960f2d62312d22a2d51d9f7085e8952a277',0),(28,'Luffy','Monkey D.','PirateKing','m.luffy@gmail.com','sha256$AMp3UUUpXrgmGrZ5$bce38984a431d57d914caa79338eaf273d532770549c67081c5ac6453e68d355',0),(32,'Rick','Sanchez','RickSanchez','rick@gmail.com','sha256$nObxBko6j1A8QiLN$d8a2e528c5d54ec30f8b6cee1f6f1828f612c2c326c6ead2652f07dcd9a8e767',0),(33,'Morty','Smith','Morty','morty@gmail.com','sha256$2o2PTJOpIT6KVUt8$c5f86c6a7bf0ed31ea02f6164a6d4b41bd73c30ecb7d2abbfb9bfd253f9bf0a5',0),(34,'Lionel','Messi','LeoMessi','l.messi@gmail.com','sha256$sz9TABgAkGJLb2nt$82fd71a39f463cd379f89def3e36cf4621ee2ec79ba9a36abcc82424375c8eaf',0),(36,'Mariano','Sanchez','m.sanchez','m.sanchez@gmail.coim','sha256$uwNIMBzrhvFStsvt$3c18f179d030dcdb79114779b33d137fc89a9b929f3ed59ea28224c9de5bab86',0),(37,'Martina','Monta├▒a','Marti','martinamont06@gmail.com','sha256$ChEH56cDu2bqIPDG$99044e0dc6946af4b33d352bba5b26676473b24f0b3a8b9c5f570cf00ea3c459',0),(38,'Finn','Mertens','FinnTheHuman','f.mertens@gmail.com','sha256$qZUcTcnZOmAWlAWc$2ef8243002d4bb224e9cfc32d0074ff6efb990054287785ee9d9dfd141ab259d',0),(39,'Jake','Mertens','JakeTheDog','j.mertens@gmail.com','sha256$lLmBsdWvkvoGZONQ$b634a290d862d667cd6ca658fbc19a89b71e233260a6dc500ec2a6d3ba762cc3',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-18 19:14:11
