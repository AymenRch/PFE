-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 01 juin 2025 à 00:27
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `memoir`
--

-- --------------------------------------------------------

--
-- Structure de la table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `expirationDate` date NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `card`
--

INSERT INTO `card` (`id`, `userId`, `number`, `expirationDate`, `type`) VALUES
(4, 4, 11111111, '2025-05-22', 'eddahabia'),
(6, 5, 2222, '2025-05-16', 'eddahabia');

-- --------------------------------------------------------

--
-- Structure de la table `contract`
--

CREATE TABLE `contract` (
  `id` int(11) NOT NULL,
  `entrepreneurId` int(11) NOT NULL,
  `investorId` int(11) NOT NULL,
  `dealId` int(11) NOT NULL,
  `investmentModel` varchar(100) NOT NULL,
  `equityPercentage` int(11) NOT NULL,
  `revenueSharePercentage` int(11) NOT NULL,
  `duration` date NOT NULL,
  `signed` varchar(50) NOT NULL,
  `projectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contract`
--

INSERT INTO `contract` (`id`, `entrepreneurId`, `investorId`, `dealId`, `investmentModel`, `equityPercentage`, `revenueSharePercentage`, `duration`, `signed`, `projectId`) VALUES
(7, 4, 5, 28, 'equity', 0, 40, '2027-05-31', 'signed', 10),
(8, 4, 5, 29, 'equity', 50, 0, '2026-05-31', 'signed', 11);

-- --------------------------------------------------------

--
-- Structure de la table `investmentdeal`
--

CREATE TABLE `investmentdeal` (
  `id` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `investorId` int(11) NOT NULL,
  `entrepreneurId` int(11) NOT NULL,
  `investmentAmount` int(11) DEFAULT NULL,
  `investmentModel` varchar(100) NOT NULL,
  `equityPercentage` int(11) DEFAULT NULL,
  `revenueSharePercentage` int(11) DEFAULT NULL,
  `duration` date NOT NULL,
  `dealStatus` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `investmentdeal`
--

INSERT INTO `investmentdeal` (`id`, `projectId`, `investorId`, `entrepreneurId`, `investmentAmount`, `investmentModel`, `equityPercentage`, `revenueSharePercentage`, `duration`, `dealStatus`) VALUES
(28, 10, 5, 4, 1200000, 'equity', 0, 40, '2027-05-31', 'accepted'),
(29, 11, 5, 4, 500000, 'equity', 50, 0, '2026-05-31', 'accepted'),
(30, 10, 5, 4, 1200000, 'equity', 32, 0, '2025-05-29', 'rejected'),
(31, 10, 5, 4, 1200000, 'revenue share', 0, 40, '2027-05-31', 'rejected'),
(32, 10, 5, 4, 1200000, 'revenue share', 0, 40, '2027-05-31', 'rejected'),
(33, 11, 5, 4, 500000, 'partnership', 30, 0, '2028-05-31', 'pending'),
(34, 10, 5, 4, 1200000, 'revenue share', 0, 40, '2027-05-31', 'pending');

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `message` varchar(200) NOT NULL,
  `timeStamp` date NOT NULL,
  `state` varchar(50) NOT NULL,
  `userType` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification`
--

INSERT INTO `notification` (`id`, `userId`, `message`, `timeStamp`, `state`, `userType`, `title`) VALUES
(8, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'read', 'entrepreneur', 'NEW REQUEST'),
(9, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'unread', 'entrepreneur', 'NEW REQUEST'),
(10, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'unread', 'entrepreneur', 'NEW REQUEST'),
(11, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'unread', 'entrepreneur', 'NEW REQUEST'),
(12, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'read', 'entrepreneur', 'NEW REQUEST'),
(13, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'read', 'entreproneur', 'NEW REQUEST'),
(14, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'read', 'entreproneur', 'NEW REQUEST'),
(15, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-18', 'read', 'investor', ''),
(16, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-18', 'read', 'investor', ''),
(17, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-18', 'unread', 'entreproneur', 'NEW REQUEST'),
(18, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-27', 'read', 'investor', ''),
(19, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-27', 'read', 'investor', ''),
(20, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-28', 'read', 'investor', ''),
(21, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-28', 'unread', 'entreproneur', 'NEW REQUEST'),
(22, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-28', 'read', 'investor', ''),
(23, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-30', 'unread', 'entreproneur', 'NEW REQUEST'),
(24, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-30', 'read', 'investor', ''),
(25, 4, 'You have a new investment request for your project: ffffffffffffffffffffff', '2025-05-30', 'unread', 'entreproneur', 'NEW REQUEST'),
(26, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-30', 'read', 'investor', ''),
(27, 4, 'You have a new investment request for your project: Cesta Fourmi', '2025-05-31', 'read', 'entreproneur', 'NEW REQUEST'),
(28, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-31', 'read', 'investor', ''),
(29, 5, 'Congratulations! One of your offers has been accepted. Please check your contracts.', '2025-05-31', 'read', 'investor', ''),
(30, 4, 'You have a new investment request for your project: Cesta Fourmi', '2025-05-31', 'unread', 'entreproneur', 'NEW REQUEST'),
(31, 4, 'You have a new investment request for your project: Cesta Fourmi', '2025-05-31', 'read', 'entreproneur', 'NEW REQUEST'),
(32, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-31', 'unread', 'investor', ''),
(33, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-31', 'unread', 'investor', ''),
(34, 4, 'You have a new investment request for your project: Cesta Fourmi', '2025-05-31', 'unread', 'entreproneur', 'NEW REQUEST'),
(35, 5, 'We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.', '2025-05-31', 'unread', 'investor', ''),
(36, 4, 'You have a new investment request for your project: café théâtre', '2025-05-31', 'unread', 'entreproneur', 'NEW REQUEST'),
(37, 4, 'You have a new investment request for your project: Cesta Fourmi', '2025-05-31', 'unread', 'entreproneur', 'NEW REQUEST');

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `fundingGoal` int(11) NOT NULL,
  `projectStatus` varchar(50) NOT NULL,
  `equetyPercentage` int(11) DEFAULT NULL,
  `revenueSharePercentage` int(11) DEFAULT NULL,
  `duration` date NOT NULL,
  `location` varchar(100) NOT NULL,
  `picture` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `userId`, `title`, `description`, `fundingGoal`, `projectStatus`, `equetyPercentage`, `revenueSharePercentage`, `duration`, `location`, `picture`, `type`, `model`) VALUES
(10, 4, 'Cesta Fourmi', 'Cesta Fourmi est une société de développement informatique spécialisée dans la création de solutions web et mobiles sur mesure. Alliant rigueur et créativité, notre équipe accompagne les startups et les entreprises dans la digitalisation de leurs idées, du concept jusqu’au produit final. ', 1200000, 'In Progress', 0, 40, '2027-05-31', 'Algiers', '/uploads/1748713382517_cesta-fourmi-Abs-computer.jpg', 'IT', 'revenue share'),
(11, 4, 'café théâtre', 'A cozy neighborhood coffee shop with a warm atmosphere, now transforming into a vibrant café-théâtre — where great coffee meets local art, live performances, and creative expression.', 500000, 'In Progress', 30, 0, '2028-05-31', 'Annaba', '/uploads/1748713977231_btyhY4sO8gWV8xiLrYKtep5ThoBO79X93vi7hILG.jpg', 'Restoration', 'partnership');

-- --------------------------------------------------------

--
-- Structure de la table `stats`
--

CREATE TABLE `stats` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalInvestmentAmount` int(11) NOT NULL,
  `totalReturns` int(11) NOT NULL,
  `activeInvestments` int(11) NOT NULL,
  `completedInvestements` int(11) NOT NULL,
  `totalFundingRaised` int(11) NOT NULL,
  `activeProjects` int(11) NOT NULL,
  `completedprojects` int(11) NOT NULL,
  `pendingInvestorRequestes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stats`
--

INSERT INTO `stats` (`id`, `userId`, `totalInvestmentAmount`, `totalReturns`, `activeInvestments`, `completedInvestements`, `totalFundingRaised`, `activeProjects`, `completedprojects`, `pendingInvestorRequestes`) VALUES
(3, 4, 0, 1000000, 0, 3, 0, 2, 0, 0),
(4, 5, 0, 0, 5, 3, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `entrepreneurId` int(11) NOT NULL,
  `investorId` int(11) NOT NULL,
  `entrepreneurCardId` int(11) NOT NULL,
  `investorCardId` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transaction`
--

INSERT INTO `transaction` (`id`, `entrepreneurId`, `investorId`, `entrepreneurCardId`, `investorCardId`, `amount`) VALUES
(1, 4, 5, 4, 3, 1200000),
(2, 4, 5, 4, 3, 500000),
(3, 4, 5, 4, 6, 1200000),
(4, 4, 5, 4, 6, 500000),
(5, 4, 5, 4, 6, 500000);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `phone` int(11) NOT NULL,
  `bio` varchar(500) NOT NULL,
  `ProfilePicture` varchar(150) NOT NULL,
  `registerDate` date NOT NULL,
  `adress` varchar(50) NOT NULL,
  `faceDescriptor` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `bio`, `ProfilePicture`, `registerDate`, `adress`, `faceDescriptor`) VALUES
(4, 'aymen RACHEDI', 'aymenrch37@gmail.com', '$2b$10$Bpxy5M067DpM22L/ocxGVOpw05/2gMv.swzZl22cpke/6aSAD/zg.', 793325728, 'A young business man motivated to close deals ', 'uploads/1746811525559_photo de moi.PNG', '2025-05-09', 'Annaba', '[-0.1268426924943924,0.16849642992019653,0.04011816531419754,-0.00641509098932147,-0.01122730877250433,-0.08988717943429947,-0.04401238635182381,-0.054183490574359894,0.1991150826215744,-0.08123058825731277,0.21971355378627777,-0.06472287327051163,-0.16213349997997284,-0.020921552553772926,-0.01303932350128889,0.0774092748761177,-0.16417911648750305,-0.06787361204624176,-0.042854662984609604,-0.053893860429525375,0.11936469376087189,-0.011346164159476757,-0.0757858157157898,0.07693205773830414,-0.1803659349679947,-0.2953907251358032,-0.0896250382065773,-0.17296428978443146,0.004647252149879932,-0.06494715809822083,-0.01593104563653469,-0.03959498554468155,-0.1263590008020401,-0.08071664720773697,0.009678042493760586,0.10066044330596924,-0.015261202119290829,-0.019404251128435135,0.12259194254875183,0.03568246588110924,-0.10505817085504532,0.01468111202120781,0.050102297216653824,0.30789628624916077,0.1665067821741104,0.11563520133495331,0.044401831924915314,-0.012404488399624825,0.13397632539272308,-0.26471462845802307,0.06115124002099037,0.0807681605219841,0.18987201154232025,0.10054910182952881,0.14910340309143066,-0.16790802776813507,0.01654629223048687,0.0780910924077034,-0.2713746428489685,0.14387989044189453,0.07896089553833008,0.021954208612442017,-0.051620714366436005,0.004103505052626133,0.27078768610954285,0.19294922053813934,-0.15474514663219452,-0.03850653022527695,0.17427921295166016,-0.19425541162490845,-0.04213031753897667,0.06787067651748657,-0.06216643750667572,-0.22157084941864014,-0.21145427227020264,0.0797751322388649,0.4674491882324219,0.20468086004257202,-0.1564423143863678,-0.04362160339951515,-0.06582719087600708,-0.014202781952917576,0.08205652981996536,0.0019002719782292843,-0.09689056128263474,-0.004266686737537384,-0.05944720283150673,0.026439545676112175,0.2102489322423935,0.040009818971157074,-0.0355631448328495,0.20603138208389282,-0.023731177672743797,-0.01598825305700302,-0.030092129483819008,-0.027139736339449883,-0.095411017537117,-0.022829072549939156,-0.0771089643239975,-0.03515450283885002,0.03989557921886444,-0.11731972545385361,-0.021109191700816154,0.05556400120258331,-0.23167277872562408,0.10730872303247452,0.0070762718096375465,-0.03924163803458214,-0.05429631099104881,0.10144857317209244,-0.1779654622077942,0.04211277887225151,0.18124395608901978,-0.2726908028125763,0.2069629281759262,0.1551082581281662,0.030336670577526093,0.13602715730667114,0.023137889802455902,0.005511036608368158,0.0709155797958374,-0.059191010892391205,-0.11267619580030441,-0.12807272374629974,-0.005554382689297199,-0.0375019907951355,0.07312599569559097,-0.0034557627514004707]'),
(5, 'test', 'minomadrid555@gmail.com', '$2b$10$moEQbemyiGl4aBrz0MyGG./AFTwby07svqOPvPFf3pg5AglYzvrhm', 793325728, 'hhhhhhhhhhhhhhhhhhhhhh', 'uploads/1746811646384_dash.png', '2025-05-09', 'Annaba', '[-0.15097536146640778,0.14997225999832153,0.044126372784376144,-0.031835492700338364,-0.030322154983878136,-0.0827205553650856,-0.051689136773347855,-0.10928045213222504,0.1906089186668396,-0.0938844084739685,0.23221518099308014,-0.05759507790207863,-0.15026482939720154,-0.0017300384351983666,-0.03305733576416969,0.062425464391708374,-0.10540829598903656,-0.10216276347637177,-0.033298105001449585,-0.0917956680059433,0.07174298912286758,-0.026349322870373726,-0.06122355908155441,0.08068007975816727,-0.1208331286907196,-0.2982954680919647,-0.10566677153110504,-0.18810859322547913,0.023164454847574234,-0.06928425282239914,-0.023755347356200218,-0.03999952971935272,-0.13135260343551636,-0.06898632645606995,-0.01601230725646019,0.060250233858823776,-0.029254714027047157,-0.041931189596652985,0.1820499300956726,0.0015651239082217216,-0.0818275436758995,-0.0015644667437300086,0.026358749717473984,0.27806615829467773,0.15155695378780365,0.08193351328372955,0.07084910571575165,0.0028401464223861694,0.14211851358413696,-0.24466031789779663,0.03105691820383072,0.10796090960502625,0.20142757892608643,0.07532309740781784,0.12807506322860718,-0.14298953115940094,0.011618991382420063,0.06379278749227524,-0.2523091435432434,0.13841457664966583,0.06110050156712532,0.025916293263435364,-0.05080922320485115,-0.009646552614867687,0.2931349575519562,0.20185615122318268,-0.13634270429611206,-0.0329819917678833,0.20217816531658173,-0.1874837875366211,-0.0380115769803524,0.046059444546699524,-0.09544601291418076,-0.2331029623746872,-0.16711866855621338,0.0869455635547638,0.4524519145488739,0.210401713848114,-0.1313110888004303,0.0013746373588219285,-0.09218695759773254,-0.0206514410674572,0.05507379025220871,-0.01785971410572529,-0.10070866346359253,-0.008241330273449421,-0.040264785289764404,0.013111362233757973,0.22424153983592987,0.034076835960149765,-0.042250856757164,0.1966516077518463,-0.03231053799390793,0.027567315846681595,-0.033814795315265656,-0.008354044519364834,-0.06097465008497238,-0.02004493959248066,-0.04461260139942169,0.032191142439842224,-0.0049155112355947495,-0.0913626104593277,0.00009191135177388787,0.05311408266425133,-0.2218531221151352,0.10267166048288345,-0.02415141835808754,-0.012993352487683296,-0.09147235006093979,0.10753250122070312,-0.13767988979816437,0.026088334619998932,0.1602524071931839,-0.27459338307380676,0.19579190015792847,0.15694113075733185,0.005692303646355867,0.14661657810211182,0.009322461672127247,-0.012446559965610504,0.09392241388559341,-0.056196726858615875,-0.13101430237293243,-0.13911643624305725,0.004069873597472906,-0.03309416025876999,0.03365962952375412,0.036677759140729904]');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dealId` (`dealId`),
  ADD KEY `entrepreneurId` (`entrepreneurId`),
  ADD KEY `investorId` (`investorId`),
  ADD KEY `projectId` (`projectId`);

--
-- Index pour la table `investmentdeal`
--
ALTER TABLE `investmentdeal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`),
  ADD KEY `investorId` (`investorId`),
  ADD KEY `entrepreneurId` (`entrepreneurId`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `contract`
--
ALTER TABLE `contract`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `investmentdeal`
--
ALTER TABLE `investmentdeal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT pour la table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `stats`
--
ALTER TABLE `stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `contract`
--
ALTER TABLE `contract`
  ADD CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`dealId`) REFERENCES `investmentdeal` (`id`),
  ADD CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`entrepreneurId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contract_ibfk_3` FOREIGN KEY (`investorId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contract_ibfk_4` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`);

--
-- Contraintes pour la table `investmentdeal`
--
ALTER TABLE `investmentdeal`
  ADD CONSTRAINT `investmentdeal_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `investmentdeal_ibfk_2` FOREIGN KEY (`investorId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `investmentdeal_ibfk_3` FOREIGN KEY (`entrepreneurId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `stats`
--
ALTER TABLE `stats`
  ADD CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
