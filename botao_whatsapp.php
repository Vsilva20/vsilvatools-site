<?php
require_once __DIR__ . '/config.php';

// Configurações globais
$whatsapp = VSILVA_WHATSAPP;
$mensagemPadrao = "Olá! Vim pelo site da Vsilva Tools e gostaria de tirar algumas dúvidas sobre os produtos.";

// Gera o link
$linkWhatsapp = "https://wa.me/$whatsapp?text=" . urlencode($mensagemPadrao);
?>
