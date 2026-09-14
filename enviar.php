<?php
  //Google reCAPTCHA
  $secretKey = 'SUA_SECRET_KEY_AQUI';
  $captcha = $_POST['g-recaptcha-response'] ?? '';

  $ip = $_SERVER['REMOTE_ADDR'];
  $verifyURL = "https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha&remoteip=$ip";

  $verifyResponse = file_get_contents($verifyURL);
  $responseData = json_decode($verifyResponse);

  if (!$responseData->success) {
    echo 'erro';
    exit;
  }

  // Dados do formulário
  $nome = $_POST['nome'] ?? '';
  $email = $_POST['email'] ?? '';
  $telefone = $_POST['telefone'] ?? '';
  $mensagem = $_POST['mensagem'] ?? '';

  $para = "vsilvatools@gmail.com";
  $assunto = "Mensagem do site - Vsilva Tools";

  $corpo = "
    <html>
    <head><meta charset='UTF-8'></head>
    <body>
      <p><strong>Nome:</strong> $nome</p>
      <p><strong>Email:</strong> $email</p>
      <p><strong>Telefone:</strong> $telefone</p>
      <p><strong>Mensagem:</strong><br>$mensagem</p>
    </body>
    </html>
  ";

  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "From: contato@vsilvatools.com.br\r\n";
  $headers .= "Reply-To: $email\r\n";

  $status = mail($para, $assunto, $corpo, $headers);

  if ($status) {
    echo 'sucesso';
  } else {
    echo 'erro';
  }
  
?>
