/* Gerado automaticamente — não edite. Rode: node comprovantes-standalone/scripts/build-configs.mjs */
(function (global) {
  global.RECEIPT_CONFIGS = {
  "consumo": {
    "title": "Gerar Comprovante - Contas de Consumo",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [
      {
        "id": "convenio",
        "label": "Convênio",
        "placeholder": "Ex: CEMIG, COPASA, SABESP, etc.",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_consumo_",
    "numZeros": 14,
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 60px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 5px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 25px;\n            font-weight: 100;\n            color: #325797;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n          }\n          .logo {\n            margin: 15px 0;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n            color: #000000 !important;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>\n                Remissão de Transação Nº<span id=\"numerotransação\"></span> -\n                Pagamento de conta consumo\n              </h4>\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Conta a Débito</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Agência/Conta:</td>\n            <td id=\"agenciaconta\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Convênio</td>\n            <td id=\"convenio\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                Informações sujeitas a confirmação. A efetivação dessa operação será\n                mediante débito em conta corrente. <br />\n                Autorizo o débito em minha conta corrente de eventual diferença\n                apurada em razão de informações inexatas por mim prestadas.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 0398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">WhatsApp: <b>bm.b.br/mel</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                <b>alo@mercantil.com.br</b>\n              </p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  "
  },
  "das": {
    "title": "Gerar Comprovante - DAS",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [
      {
        "id": "convenio",
        "label": "Convênio",
        "placeholder": "Ex: DAS, DARF, etc.",
        "required": true
      },
      {
        "id": "possuiCodigo",
        "label": "Possui código de barras",
        "type": "select",
        "options": [
          {
            "value": "sim",
            "label": "Sim"
          },
          {
            "value": "nao",
            "label": "Não"
          }
        ],
        "defaultValue": "sim",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_das_",
    "numZeros": 14,
    "conditionalFields": [
      {
        "id": "codigoBarras",
        "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>"
      }
    ],
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 40px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 2px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 18px;\n            font-weight: 100;\n            color: #325797 !important;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n            color: #000000 !important;\n          }\n          .logo {\n            margin: 2px 0 9px;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n            color: #000000 !important;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>\n                Remissão de Transação Nº<span id=\"numerotransação\"></span> -\n                Pagamento de DAS\n              </h4>\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Conta a Débito</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Agência/Conta:</td>\n            <td id=\"agenciaconta\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome do Convênio</td>\n            <td id=\"convenio\"></td>\n          </tr>\n          <tr class=\"mb\" id=\"codigo\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                Comprovante aprovado pela SRF - ADE Conjunto Corat/Cotec numero 001/2006. <br>\n                Guarde este comprovante junto com o DARF/DARF SIMPLES. <br>\n                Declaro estar ciente de que havendo informações inexatas por mim prestadas durante a transação que gerou este documento a Receita Federal do Brasil poderá\n                não efetivar a baixa do documento, e desobrigo neste ato o Banco Mercantil de qualquer responsabilidade sobre a cobrança de complemento ou de encargos.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">WhatsApp: <b>bm.b.br/mel</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                <b>alo@mercantil.com.br</b>\n              </p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  "
  },
  "fgts": {
    "title": "Gerar Comprovante - FGTS",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor do Documento"
      },
      {
        "id": "valorPago",
        "label": "Valor Pago"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "competencia",
        "label": "Competência"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "convenio",
        "label": "Convênio"
      }
    ],
    "fileNamePrefix": "comprovante_fgts_",
    "numZeros": 10,
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 60px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 5px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 25px;\n            font-weight: 100;\n            color: #325797;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n          }\n          .logo {\n            margin: 15px 0;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n            color: #000000 !important;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>\n                Remissão de Transação Nº<span id=\"numerotransação\"></span> -\n                Recolhimento FGTS\n              </h4>\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n          <br />\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr class=\"mb\">\n            <td>Pagador</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Competência</td>\n            <td id=\"competencia\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor do Documento</td>\n            <td id=\"valorDocumento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor dos Juros/Multa</td>\n            <td id=\"jurosMulta\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Convenio</td>\n            <td id=\"convenio\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>NSU</td>\n            <td id=\"nsu\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Agência Recebedora</td>\n            <td id=\"agenciaRecebedora\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                Este documento deve ser mantido anexado à GFIP ou documento\n                equivalente. Os Dados da obrigação informados para emissão deste\n                comprovante são de responsabilidade exclusiva do contribuínte.\n                <br />\n                Declaro estar ciente de que havendo informações inexatas por mim\n                prestadas durante a transação que gerou este documento a conveniada\n                poderá não efetivar a baixa do pagamento, e desobrigo neste ato o\n                Mercantil do Brasil de qualquer responsabilidade sobre a cobrança de\n                complemento ou de erncargos.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 0398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\"><b>2ª VIA</b></p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  "
  },
  "gps": {
    "title": "Gerar Comprovante - GPS",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [
      {
        "id": "possuiCodigo",
        "label": "Possui código de barras",
        "type": "select",
        "options": [
          {
            "value": "sim",
            "label": "Sim"
          },
          {
            "value": "nao",
            "label": "Não"
          }
        ],
        "defaultValue": "sim",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_gps_",
    "numZeros": 14,
    "conditionalFields": [
      {
        "id": "codigoBarras",
        "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>"
      }
    ],
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 40px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 2px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 18px;\n            font-weight: 100;\n            color: #325797;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n          }\n          .logo {\n            margin: 2px 0 9px;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              Remissão de transação Previdência Social - GPS\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr class=\"mb\" id=\"codigo\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                O comprovante de pagamento de GPS está de acordo com a Portaria RFB\n                nº 1976, de 19 de Nov/2008 e Ato Declaratório Executivo Corat/Cotec\n                nº 1, de 23 de março de 2006.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">WhatsApp: <b>bm.b.br/mel</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                <b>alo@mercantil.com.br</b>\n              </p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  "
  },
  "dae": {
    "title": "Gerar Comprovante - DARF",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [
      {
        "id": "convenio",
        "label": "Convênio",
        "placeholder": "Informe o convênio aqui",
        "required": true
      },
      {
        "id": "possuiCodigo",
        "label": "Possui código de barras",
        "type": "select",
        "options": [
          {
            "value": "sim",
            "label": "Sim"
          },
          {
            "value": "nao",
            "label": "Não"
          }
        ],
        "defaultValue": "sim",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "docDae",
        "label": "Nº do Documento DAE"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_darf_",
    "numZeros": 14,
    "conditionalFields": [
      {
        "id": "codigoBarras",
        "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>"
      }
    ],
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 40px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 2px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 18px;\n            font-weight: 100;\n            color: #325797 !important;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n            color: #000000 !important;\n          }\n          .logo {\n            margin: 2px 0 9px;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n            color: #000000 !important;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>\n                Remissão de Transação Nº<span id=\"numerotransação\"></span> -\n                Pagamento DAE - DAF\n              </h4>\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr class=\"mb\">\n            <td>Conta a Débito</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Agência/Conta:</td>\n            <td id=\"agenciaconta\"></td>\n          </tr>\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr class=\"mb\">\n            <td>Nome do Convênio</td>\n            <td id=\"convenio\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nro do Documento DAE</td>\n            <td id=\"docDae\"></td>\n          </tr>\n          <tr class=\"mb\" id=\"codigo\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                Autorizo o débito em minha conta corrente de eventual diferença\n                apurada em razão de informações inexatas por mim prestadas.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">WhatsApp: <b>bm.b.br/mel</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                <b>alo@mercantil.com.br</b>\n              </p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  ",
    "customExtractors": {}
  },
  "ficha": {
    "title": "Gerar Comprovante - Ficha de Compensação",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor Nominal"
      },
      {
        "id": "valorPago",
        "label": "Valor Pago"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "cpfCnpj",
        "label": "CPF/CNPJ",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_ficha_",
    "numZeros": 10,
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 60px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 5px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 25px;\n            font-weight: 100;\n            color: #325797;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n          }\n          .logo {\n            margin: 15px 0;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n            color: #000000 !important;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              Remissão de Pagamento Ficha Compensação\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n          <br />\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n\n          <tr class=\"mb\">\n            <td>Pagador</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>CPF/CPJ:</td>\n            <td id=\"cpfcnpj\"></td>\n          </tr>\n\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Nominal</td>\n            <td id=\"valorDocumento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Encargos</td>\n            <td id=\"encargos\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Desconto</td>\n            <td id=\"desconto\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">\n                Em caso de digitação incorreta de dados que ocasione pagamento de\n                valor inferior ao devido, autorizo o débito dessa diferença em minha\n                conta-corrente. Se o Banco beneficiário deste pagamento recusá-lo,\n                autorizo o crédito, em minha conta-corrente, do valor pago indicado\n                nesta transação. <br />\n                ATENÇÃO: Prezado cliente, este pagamento não poderá ser cancelado\n                após efetivação.\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 0398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\"><b>2ª VIA</b></p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  ",
    "customExtractors": {}
  },
  "tributo_municipal": {
    "title": "Gerar Comprovante - Tributo Municipal",
    "subtitle": "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    "formFields": [
      {
        "id": "municipio",
        "label": "Município",
        "placeholder": "Informe o município aqui",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_tributo_",
    "numZeros": 14,
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Comprovante</title>\n        <style>\n          * {\n            font-family: \"Roboto\", sans-serif;\n            color: #000000 !important;\n          }\n          table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 40px;\n            page-break-inside: auto;\n          }\n          th, td {\n            padding: 2px;\n            text-align: left;\n            font-size: 12px;\n            color: #000000 !important;\n          }\n          .col1 {\n            width: 30%;\n          }\n          .col2 {\n            text-align: center;\n            font-size: 18px;\n            font-weight: 100;\n            color: #325797;\n          }\n          .footer1, .footer2, .footer3 {\n            text-align: center;\n            margin: 0.5px;\n          }\n          .footer1 {\n            font-weight: 600;\n          }\n          .logo {\n            margin: 2px 0 9px;\n          }\n          .mb {\n            border-bottom: 1px solid rgba(0, 0, 0, 0.164);\n          }\n          .foco {\n            font-weight: 700;\n          }\n          h4 {\n            font-size: 19px;\n            color: #000000 !important;\n          }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>\n                Remissão de Transação Nº<span id=\"numerotransação\"></span> - Pagamento\n                de tributo municipal\n              </h4>\n            </th>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr></tr>\n          <tr class=\"mb\">\n            <td>Data de Emissão</td>\n            <td id=\"DataEmissão\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Canal de Pagamento</td>\n            <td id=\"canalPagamento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Forma de pagamento</td>\n            <td id=\"formaPagamento\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Conta a Débito</td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Nome:</td>\n            <td id=\"nomepagador\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Agência/Conta:</td>\n            <td id=\"agenciaconta\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Código de Barras</td>\n            <td id=\"codigoBarras\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Valor Pago</td>\n            <td id=\"valorPago\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Pagamento</td>\n            <td id=\"dataMovimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Data do Vencimento</td>\n            <td id=\"dataVencimento\"></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Município</td>\n            <td id=\"municipio\"></td>\n          </tr>\n          <tr>\n            <td><br /></td>\n            <td></td>\n          </tr>\n          <tr class=\"mb\">\n            <td>Autenticação</td>\n            <td id=\"autenticacao\"></td>\n          </tr>\n\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer1\">Operação realizada mediante débito em conta.</p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">SAC MB <b>0800 707 398</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">WhatsApp: <b>bm.b.br/mel</b></p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"footer3\">\n                <b>alo@mercantil.com.br</b>\n              </p>\n            </td>\n          </tr>\n        </table>\n      </body>\n    </html>\n  ",
    "customExtractors": {}
  },
  "dare_sp": {
    "displayLabel": "DARE SP",
    "title": "Gerar Comprovante - DARE SP",
    "subtitle": "Cole o LOG da transação e informe o convênio.",
    "formFields": [
      {
        "id": "municipio",
        "label": "Convênio",
        "placeholder": "Informe o convênio aqui",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "dataVencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "controleDARE",
        "label": "Nº de Controle DARE",
        "fullWidth": true
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_dare_sp_",
    "numZeros": 14,
    "minBarcodeLength": 44,
    "authIncludeHorario": false,
    "customExtractors": {},
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <title>Comprovante DARE SP</title>\n        <style>\n          * { font-family: \"Roboto\", sans-serif; color: #000000 !important; }\n          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }\n          th, td { padding: 2px; text-align: left; font-size: 12px; }\n          .col2 { text-align: center; font-size: 18px; color: #325797 !important; }\n          .footer1, .footer2, .footer3 { text-align: center; margin: 0.5px; }\n          .footer1 { font-weight: 600; }\n          .mb { border-bottom: 1px solid rgba(0, 0, 0, 0.164); }\n          .foco { font-weight: 700; }\n          h4 { font-size: 19px; }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>Remissão de Transação Nº<span id=\"numerotransação\"></span> — DARE SP</h4>\n            </th>\n          </tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Data de Emissão</td><td id=\"DataEmissão\"></td></tr>\n          <tr class=\"mb\"><td>Canal de Pagamento</td><td id=\"canalPagamento\"></td></tr>\n          <tr class=\"mb\"><td>Forma de pagamento</td><td id=\"formaPagamento\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td colspan=\"2\">Conta a Débito</td></tr>\n          <tr class=\"mb\"><td>Nome:</td><td id=\"nomepagador\"></td></tr>\n          <tr class=\"mb\"><td>Agência/Conta:</td><td id=\"agenciaconta\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Convênio</td><td id=\"municipio\"></td></tr>\n          <tr class=\"mb\"><td>Nº Controle DARE</td><td id=\"controleDARE\"></td></tr>\n          <tr class=\"mb\"><td>Código de Barras</td><td id=\"codigoBarras\"></td></tr>\n          <tr class=\"mb\"><td>Valor Pago</td><td id=\"valorPago\"></td></tr>\n          <tr class=\"mb\"><td>Data do Pagamento</td><td id=\"dataMovimento\"></td></tr>\n          <tr class=\"mb\"><td>Data de Vencimento</td><td id=\"dataVencimento\"></td></tr>\n          <tr class=\"mb\"><td>NSU</td><td id=\"nsu\"></td></tr>\n          <tr class=\"mb\"><td>Agência Recebedora</td><td id=\"agenciaRecebedora\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Autenticação</td><td id=\"autenticacao\"></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer1\">Informações sujeitas a confirmação. Guarde este comprovante.</p></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer3\">SAC MB <b>0800 707 0398</b></p></td></tr>\n        </table>\n      </body>\n    </html>\n  "
  },
  "ipva_mg": {
    "displayLabel": "IPVA MG",
    "title": "Gerar Comprovante - IPVA MG",
    "subtitle": "Cole o LOG da transação e informe o convênio.",
    "formFields": [
      {
        "id": "convenio",
        "label": "Convênio",
        "placeholder": "Informe o convênio aqui",
        "required": true
      }
    ],
    "extractFields": [
      {
        "id": "nsu",
        "label": "Nº da Transação"
      },
      {
        "id": "valorDocumento",
        "label": "Valor"
      },
      {
        "id": "dataPagamento",
        "label": "Data de Pagamento"
      },
      {
        "id": "vencimento",
        "label": "Data de Vencimento"
      },
      {
        "id": "exercicio",
        "label": "Exercício"
      },
      {
        "id": "renavam",
        "label": "RENAVAM"
      },
      {
        "id": "cotaParcela",
        "label": "Cota/Parcela",
        "fullWidth": true
      },
      {
        "id": "codigoBarras",
        "label": "Código de Barras",
        "fullWidth": true
      },
      {
        "id": "nome",
        "label": "Nome",
        "fullWidth": true
      },
      {
        "id": "agenciaConta",
        "label": "Agência/Conta",
        "fullWidth": true
      }
    ],
    "fileNamePrefix": "comprovante_ipva_mg_",
    "numZeros": 10,
    "minBarcodeLength": 44,
    "customExtractors": {},
    "receiptTemplate": "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <title>Comprovante IPVA MG</title>\n        <style>\n          * { font-family: \"Roboto\", sans-serif; color: #000000 !important; }\n          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }\n          th, td { padding: 2px; text-align: left; font-size: 12px; }\n          .col2 { text-align: center; font-size: 18px; color: #325797 !important; }\n          .footer1, .footer2, .footer3 { text-align: center; margin: 0.5px; }\n          .footer1 { font-weight: 600; }\n          .mb { border-bottom: 1px solid rgba(0, 0, 0, 0.164); }\n          .foco { font-weight: 700; }\n          h4 { font-size: 19px; }\n        </style>\n      </head>\n      <body>\n        <table id=\"comprovanteTable\">\n          <tr>\n            <th class=\"col2\" colspan=\"2\">\n              <div class=\"logo\"><img src=\"/logomerc.png\"></div><br />\n              <h4>Remissão de Transação Nº<span id=\"numerotransação\"></span> — IPVA MG</h4>\n            </th>\n          </tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Data de Emissão</td><td id=\"DataEmissão\"></td></tr>\n          <tr class=\"mb\"><td>Canal de Pagamento</td><td id=\"canalPagamento\"></td></tr>\n          <tr class=\"mb\"><td>Forma de pagamento</td><td id=\"formaPagamento\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td colspan=\"2\">Conta a Débito</td></tr>\n          <tr class=\"mb\"><td>Nome:</td><td id=\"nomepagador\"></td></tr>\n          <tr class=\"mb\"><td>Agência/Conta:</td><td id=\"agenciaconta\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Convênio</td><td id=\"convenio\"></td></tr>\n          <tr class=\"mb\"><td>Exercício</td><td id=\"exercicio\"></td></tr>\n          <tr class=\"mb\"><td>RENAVAM</td><td id=\"renavam\"></td></tr>\n          <tr class=\"mb\"><td>Cota/Parcela</td><td id=\"cotaParcela\"></td></tr>\n          <tr class=\"mb\"><td>Código de Barras</td><td id=\"codigoBarras\"></td></tr>\n          <tr class=\"mb\"><td>Valor Pago</td><td id=\"valorPago\"></td></tr>\n          <tr class=\"mb\"><td>Data do Pagamento</td><td id=\"dataMovimento\"></td></tr>\n          <tr class=\"mb\"><td>Data de Vencimento</td><td id=\"vencimento\"></td></tr>\n          <tr class=\"mb\"><td>NSU</td><td id=\"nsu\"></td></tr>\n          <tr class=\"mb\"><td>Agência Recebedora</td><td id=\"agenciaRecebedora\"></td></tr>\n          <tr><td colspan=\"2\"><br /></td></tr>\n          <tr class=\"mb\"><td>Autenticação</td><td id=\"autenticacao\"></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer1\">Informações sujeitas a confirmação. Guarde este comprovante.</p></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer2\">Ouvidoria MB <b>0800 707 0384</b></p></td></tr>\n          <tr><td colspan=\"2\"><p class=\"footer3\">SAC MB <b>0800 707 0398</b></p></td></tr>\n        </table>\n      </body>\n    </html>\n  "
  }
};
})(typeof window !== "undefined" ? window : globalThis);
