export default function generateEmailTemplate(url, email, purpose) {
  return `<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <title> </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #outlook a {
        padding: 0;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix {
          width: 100% !important;
        }
      </style>
    <![endif]-->
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }

        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
  </head>

  <body style="word-spacing: normal; background-color: #fafbfc">
${
  purpose === "reset_password"
    ? `<div style="background-color: #fafbfc; padding-bottom: 50px">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: 300px">
                                  <img
                                    height="auto"
                                    src="https://res.cloudinary.com/dtii73rrk/image/upload/v1679947737/4_iz25fy.png"
                                    style="
                                      border: 0;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 13px;
                                    "
                                    width="300"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div
        style="
          background: #ffffff;
          background-color: #ffffff;
          margin: 0px auto;
          max-width: 600px;
        "
      >
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="background: #ffffff; background-color: #ffffff; width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Someone has requested a password reset for the
                            following account:
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Site Name: seniormanagers.com
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Account Email: ${email}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          vertical-align="middle"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: separate; line-height: 100%"
                          >
                            <tr>
                              <td
                                align="center"
                                bgcolor="#003A9B"
                                role="presentation"
                                style="
                                  border: none;
                                  border-radius: 8px;
                                  cursor: auto;
                                  mso-padding-alt: 10px 25px;
                                  background: #003a9b;
                                "
                                valign="middle"
                              >
                                <a
                                  href="${url}"
                                  style="
                                    display: inline-block;
                                    background: #003a9b;
                                    color: #ffffff;
                                    font-family: open Sans Helvetica, Arial,
                                      sans-serif;
                                    font-size: 18px;
                                    font-weight: normal;
                                    line-height: 120%;
                                    margin: 0;
                                    text-decoration: none;
                                    text-transform: none;
                                    padding: 10px 25px;
                                    mso-padding-alt: 0px;
                                    border-radius: 8px;
                                  "
                                  target="_blank"
                                >
                                  Click here to reset your password
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 14px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            If this was a mistake, just ignore this email and
                            nothing will happen.
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 14px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Have any questions or concerns? Reach out to us via
                            support@seniormanagers.com
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 14px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Sent from seniormanagers.com
                          </div>
                        </td>
                      </tr>
                      
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>`
    : purpose === "verify_email"
    ? `<div style="background-color: #fafbfc; padding-bottom: 50px">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: 300px">
                                  <img
                                    height="auto"
                                    src="https://res.cloudinary.com/dtii73rrk/image/upload/v1679947737/4_iz25fy.png"
                                    style="
                                      border: 0;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 13px;
                                    "
                                    width="300"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div
        style="
          background: #ffffff;
          background-color: #ffffff;
          margin: 0px auto;
          max-width: 600px;
        "
      >
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="background: #ffffff; background-color: #ffffff; width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Verify your email address
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            In order to start using your Seniormanagers account,
                            you need to confirm your email address.
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          vertical-align="middle"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: separate; line-height: 100%"
                          >
                            <tr>
                              <td
                                align="center"
                                bgcolor="#003A9B"
                                role="presentation"
                                style="
                                  border: none;
                                  border-radius: 8px;
                                  cursor: auto;
                                  mso-padding-alt: 10px 25px;
                                  background: #003a9b;
                                "
                                valign="middle"
                              >
                                <a
                                  href="${url}"
                                  style="
                                    display: inline-block;
                                    background: #003a9b;
                                    color: #ffffff;
                                    font-family: open Sans Helvetica, Arial,
                                      sans-serif;
                                    font-size: 18px;
                                    font-weight: normal;
                                    line-height: 120%;
                                    margin: 0;
                                    text-decoration: none;
                                    text-transform: none;
                                    padding: 10px 25px;
                                    mso-padding-alt: 0px;
                                    border-radius: 8px;
                                  "
                                  target="_blank"
                                >
                                  Verify Email Address
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 14px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            If you did not sign up for this account you can
                            ignore this email and the account will be deleted.
                          </div>
                        </td>
                      </tr>

                      <!-- <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Thanks! <br />The Seniormanagers team.
                          </div>
                        </td>
                      </tr> -->
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>`
    : purpose === "verify_email_to_create_user"
    ? `<div style="background-color: #fafbfc; padding-bottom: 50px">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: 300px">
                                  <img
                                    height="auto"
                                    src="https://res.cloudinary.com/dtii73rrk/image/upload/v1679947737/4_iz25fy.png"
                                    style="
                                      border: 0;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 13px;
                                    "
                                    width="300"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div
        style="
          background: #ffffff;
          background-color: #ffffff;
          margin: 0px auto;
          max-width: 600px;
        "
      >
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="background: #ffffff; background-color: #ffffff; width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 20px;
                  padding-top: 20px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Verify your email address
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                          An user has been creted with your email address.
                            In order to start using your Seniormanagers account,
                            you need to confirm your email address.
                          </div>

                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 20px;
                              margin-top:10px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                          Account Email: ${email}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          align="center"
                          vertical-align="middle"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: separate; line-height: 100%"
                          >
                            <tr>
                              <td
                                align="center"
                                bgcolor="#003A9B"
                                role="presentation"
                                style="
                                  border: none;
                                  border-radius: 8px;
                                  cursor: auto;
                                  mso-padding-alt: 10px 25px;
                                  background: #003a9b;
                                "
                                valign="middle"
                              >
                                <a
                                  href="${url}"
                                  style="
                                    display: inline-block;
                                    background: #003a9b;
                                    color: #ffffff;
                                    font-family: open Sans Helvetica, Arial,
                                      sans-serif;
                                    font-size: 18px;
                                    font-weight: normal;
                                    line-height: 120%;
                                    margin: 0;
                                    text-decoration: none;
                                    text-transform: none;
                                    padding: 10px 25px;
                                    mso-padding-alt: 0px;
                                    border-radius: 8px;
                                  "
                                  target="_blank"
                                >
                                  Verify Email Address
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 14px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            You are receiving this email because you have been invited as a user to Seniormanagers recruitment platform. If you are not sure why you are receiving this, please ignore it.
                          </div>
                        </td>
                      </tr>

                      <!-- <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: open Sans Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              line-height: 1;
                              text-align: center;
                              color: #000000;
                            "
                          >
                            Thanks! <br />The Seniormanagers team.
                          </div>
                        </td>
                      </tr> -->
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>`
    : null
}
  </body>
</html>
`;
}
