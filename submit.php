<?php

header("Content-Type: application/json; charset=UTF-8");


/*
|--------------------------------------------------------------------------
| YOUR EMAIL
|--------------------------------------------------------------------------
|
| Questionnaire submissions will be sent here.
|
*/

$recipient = "sthabilenzama5@gmail.com";


/*
|--------------------------------------------------------------------------
| ONLY ACCEPT POST REQUESTS
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| GET FORM DATA SAFELY
|--------------------------------------------------------------------------
*/

function clean($value) {

    return htmlspecialchars(
        trim($value ?? ""),
        ENT_QUOTES,
        "UTF-8"
    );

}


$fullName = clean($_POST["fullName"] ?? "");

$email = clean($_POST["email"] ?? "");

$phone = clean($_POST["phone"] ?? "");

$location = clean($_POST["location"] ?? "");

$about = clean($_POST["about"] ?? "");

$education = clean($_POST["education"] ?? "");

$experience = clean($_POST["experience"] ?? "");

$achievements = clean($_POST["achievements"] ?? "");

$skills = clean($_POST["skills"] ?? "");

$otherSkills = clean($_POST["otherSkills"] ?? "");

$jobType = clean($_POST["jobType"] ?? "");

$industry = clean($_POST["industry"] ?? "");

$jobNotes = clean($_POST["jobNotes"] ?? "");

$jobConsent = clean($_POST["jobConsent"] ?? "");


/*
|--------------------------------------------------------------------------
| BASIC VALIDATION
|--------------------------------------------------------------------------
*/

if (
    empty($fullName) ||
    empty($email) ||
    empty($about)
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please complete the required fields."
    ]);

    exit;

}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);

    exit;

}


/*
|--------------------------------------------------------------------------
| EMAIL SUBJECT
|--------------------------------------------------------------------------
*/

$subject =
    "New Help Me Help You Questionnaire - " .
    $fullName;


/*
|--------------------------------------------------------------------------
| EMAIL CONTENT
|--------------------------------------------------------------------------
*/

$message = "

NEW HELP ME HELP YOU QUESTIONNAIRE
==================================

ABOUT YOU
---------

Full Name:
$fullName

Email:
$email

Phone / WhatsApp:
$phone

Location:
$location


ABOUT THE PERSON
----------------

$about


EDUCATION
---------

$education


WORK EXPERIENCE
---------------

$experience


ACHIEVEMENTS & PROJECTS
-----------------------

$achievements


SKILLS
------

$skills


OTHER SKILLS
------------

$otherSkills


OPPORTUNITY INTERESTS
---------------------

Type of Opportunity:
$jobType

Preferred Industry:
$industry


ADDITIONAL INFORMATION
----------------------

$jobNotes


CONTACT CONSENT
---------------

Wants to be contacted about suitable opportunities:
$jobConsent


==================================
Submitted through Help Me Help You
";


/*
|--------------------------------------------------------------------------
| EMAIL HEADERS
|--------------------------------------------------------------------------
*/

$headers = [];

$headers[] =
    "From: Help Me Help You <no-reply@" .
    $_SERVER["HTTP_HOST"] .
    ">";

$headers[] =
    "Reply-To: " . $email;

$headers[] =
    "Content-Type: text/plain; charset=UTF-8";


/*
|--------------------------------------------------------------------------
| SEND EMAIL
|--------------------------------------------------------------------------
*/

$sent = mail(
    $recipient,
    $subject,
    $message,
    implode("\r\n", $headers)
);


/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

if ($sent) {

    echo json_encode([
        "success" => true,
        "message" => "Questionnaire submitted successfully."
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "The server could not send the questionnaire."
    ]);

}

?>