-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: customer_data
-- ------------------------------------------------------
-- Server version	5.7.41-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NextAppointmentDate` date DEFAULT NULL,
  `ContractedSales` int(11) DEFAULT NULL,
  `CurrentContractCount` int(11) DEFAULT NULL,
  `CompanyName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CompanyNameKana` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Capital` int(11) DEFAULT NULL,
  `EmployeesCount` int(11) DEFAULT NULL,
  `AppointmentDepartment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactPersonName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactPersonKana` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `URL` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'2024-04-01',5000000,80,'株式会社テストデータ','カブシキガイシャテストデータ',12000000,35,'開発部','鈴木一郎','スズキイチロウ','https://www.testdata.co.jp'),(2,'2024-04-05',2000000,35,'有限会社デモ','ユウゲンガイシャデモ',3000000,10,'デモ部','田島みゆき','タジマミユキ','https://www.demo.co.jp'),(3,'2024-04-10',8000000,65,'株式会社サンプルデータ','カブシキガイシャサンプルデータ',15000000,50,'生産部','山口拓也','ヤマグチタクヤ','https://www.sampledata.co.jp'),(4,'2024-04-15',3000000,40,'有限会社モック','ユウゲンガイシャモック',5000000,25,'モック部','佐々木美咲','ササキミサキ','https://www.mock.co.jp'),(5,'2024-04-20',6000000,55,'株式会社データサンプル','カブシキガイシャデータサンプル',8000000,30,'営業部','中村健太郎','ナカムラケンタロウ','https://www.datasample.co.jp'),(6,'2024-04-25',7000000,75,'有限会社テストデータ','ユウゲンガイシャテストデータ',10000000,45,'テスト部','小林奈緒','コバヤシナオ','https://www.testdata.co.jp'),(7,'2024-05-01',9000000,30,'株式会社プロトタイプデータ','カブシキガイシャプロトタイプデータ',18000000,60,'プロトタイプ部','田中良太','タナカリョウタ','https://www.prototypedata.co.jp'),(8,'2024-05-05',4000000,50,'有限会社イメージデータ','ユウゲンガイシャイメージデータ',12000000,40,'企画部','岡本みさき','オカモトミサキ','https://www.imagedata.co.jp'),(9,'2024-05-10',2500000,25,'株式会社デザインデータ','カブシキガイシャデザインデータ',7000000,20,'デザイン部','加藤和也','カトウカズヤ','https://www.designdata.co.jp'),(10,'2024-05-15',12000000,60,'有限会社コンサルトデータ','ユウゲンガイシャコンサルトデータ',25000000,70,'コンサルティング部','伊藤みさ','イトウミサ','https://www.consultdata.co.jp');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-20 12:03:57
