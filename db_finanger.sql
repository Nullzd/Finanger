-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema db_finanger
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `db_finanger` ;

-- -----------------------------------------------------
-- Schema db_finanger
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_finanger` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `db_finanger` ;

-- -----------------------------------------------------
-- Table `db_finanger`.`tb_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_finanger`.`tb_usuario` (
  `cod_usu` INT NOT NULL AUTO_INCREMENT,
  `nome_usu` VARCHAR(255) NULL DEFAULT NULL,
  `email_usu` VARCHAR(255) NULL DEFAULT NULL,
  `senha_usu` VARCHAR(45) NULL DEFAULT NULL,
  `hash_usu` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_usu`),
  UNIQUE INDEX `email_usu_UNIQUE` (`email_usu` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `db_finanger`.`tb_movimentacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_finanger`.`tb_movimentacao` (
  `cod_mov` INT NOT NULL,
  `usuario_mov` INT NOT NULL,
  `data_mov` DATETIME NOT NULL,
  `tipo_mov` CHAR(1) NULL DEFAULT NULL,
  `categoria_mov` VARCHAR(45) NULL DEFAULT NULL,
  `descricao_mov` VARCHAR(100) NULL DEFAULT NULL,
  `debito_mov` DECIMAL(18,2) NULL DEFAULT '0.00',
  `credito_mov` DECIMAL(18,2) NULL DEFAULT '0.00',
  PRIMARY KEY (`cod_mov`, `usuario_mov`),
  INDEX `usuario_idx` (`usuario_mov` ASC) VISIBLE,
  CONSTRAINT `usuario`
    FOREIGN KEY (`usuario_mov`)
    REFERENCES `db_finanger`.`tb_usuario` (`cod_usu`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `db_finanger` ;

-- -----------------------------------------------------
-- Placeholder table for view `db_finanger`.`vw_histmovimentacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_finanger`.`vw_histmovimentacao` (`cod_mov` INT, `usuario_mov` INT, `data_mov` INT, `tipo_mov` INT, `categoria_mov` INT, `descricao_mov` INT, `valor_mov` INT);

-- -----------------------------------------------------
-- Placeholder table for view `db_finanger`.`vw_saldodia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_finanger`.`vw_saldodia` (`usuario_mov` INT, `data` INT, `saldo_ant` INT, `movimentacao` INT, `saldo_atual` INT);

-- -----------------------------------------------------
-- View `db_finanger`.`vw_histmovimentacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_finanger`.`vw_histmovimentacao`;
USE `db_finanger`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `db_finanger`.`vw_histmovimentacao` AS select `mov`.`cod_mov` AS `cod_mov`,`mov`.`usuario_mov` AS `usuario_mov`,`mov`.`data_mov` AS `data_mov`,`mov`.`tipo_mov` AS `tipo_mov`,`mov`.`categoria_mov` AS `categoria_mov`,`mov`.`descricao_mov` AS `descricao_mov`,`mov`.`valor_mov` AS `valor_mov` from (select 0 AS `cod_mov`,`ma`.`usuario_mov` AS `usuario_mov`,concat(cast(`ma`.`data_mov` as date),' ','00:00:00') AS `data_mov`,'S' AS `tipo_mov`,'' AS `categoria_mov`,'Saldo Anterior' AS `descricao_mov`,(select coalesce((sum(`ma1`.`credito_mov`) - sum(`ma1`.`debito_mov`)),0) from `db_finanger`.`tb_movimentacao` `ma1` where ((cast(`ma1`.`data_mov` as date) < cast(`ma`.`data_mov` as date)) and (`ma1`.`usuario_mov` = `ma`.`usuario_mov`))) AS `valor_mov` from `db_finanger`.`tb_movimentacao` `ma` group by cast(`ma`.`data_mov` as date),`ma`.`usuario_mov` union all select `m`.`cod_mov` AS `cod_mov`,`m`.`usuario_mov` AS `usuario_mov`,`m`.`data_mov` AS `data_mov`,`m`.`tipo_mov` AS `tipo_mov`,`m`.`categoria_mov` AS `categoria_mov`,`m`.`descricao_mov` AS `descricao_mov`,(`m`.`credito_mov` - `m`.`debito_mov`) AS `valor_mov` from `db_finanger`.`tb_movimentacao` `m` union all select (select (max(`db_finanger`.`tb_movimentacao`.`cod_mov`) + 1) from `db_finanger`.`tb_movimentacao`) AS `cod_mov`,`md`.`usuario_mov` AS `usuario_mov`,concat(cast(`md`.`data_mov` as date),' ','23:59:59') AS `data_mov`,'S' AS `tipo_mov`,'' AS `categoria_mov`,'Saldo' AS `descricao_mov`,(select (sum(`md1`.`credito_mov`) - sum(`md1`.`debito_mov`)) from `db_finanger`.`tb_movimentacao` `md1` where ((`md1`.`data_mov` <= concat(cast(`md`.`data_mov` as date),' ','23:59:59')) and (`md1`.`usuario_mov` = `md`.`usuario_mov`))) AS `valor_mov` from `db_finanger`.`tb_movimentacao` `md` group by concat(cast(`md`.`data_mov` as date),' ','23:59:59'),`md`.`usuario_mov`) `mov` order by `mov`.`usuario_mov`,`mov`.`data_mov`,`mov`.`cod_mov`;

-- -----------------------------------------------------
-- View `db_finanger`.`vw_saldodia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_finanger`.`vw_saldodia`;
USE `db_finanger`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `db_finanger`.`vw_saldodia` AS select `m`.`usuario_mov` AS `usuario_mov`,cast(`m`.`data_mov` as date) AS `data`,coalesce((select (sum(`ma`.`credito_mov`) - sum(`ma`.`debito_mov`)) from `db_finanger`.`tb_movimentacao` `ma` where (cast(`ma`.`data_mov` as date) < cast(`m`.`data_mov` as date))),0) AS `saldo_ant`,(sum(`m`.`credito_mov`) - sum(`m`.`debito_mov`)) AS `movimentacao`,(coalesce((select (sum(`ma`.`credito_mov`) - sum(`ma`.`debito_mov`)) from `db_finanger`.`tb_movimentacao` `ma` where (cast(`ma`.`data_mov` as date) < cast(`m`.`data_mov` as date))),0) + (sum(`m`.`credito_mov`) - sum(`m`.`debito_mov`))) AS `saldo_atual` from `db_finanger`.`tb_movimentacao` `m` group by `m`.`usuario_mov`,cast(`m`.`data_mov` as date);
USE `db_finanger`;

DELIMITER $$
USE `db_finanger`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `db_finanger`.`tb_movimentacao_BEFORE_INSERT`
BEFORE INSERT ON `db_finanger`.`tb_movimentacao`
FOR EACH ROW
BEGIN
	set new.cod_mov = (select coalesce(max(cod_mov),0) + 1 from tb_movimentacao where usuario_mov = new.usuario_mov);
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
