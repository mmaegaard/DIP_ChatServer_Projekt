================================================================================================================
===== ChangeLog =====
Skriv her, hvilke klasser, der er ændret siden du sidst sendte noget ind. 
Slet ikke andre beskeder her, vi vil gerne have en nogenlunde tidslinje.

================================================================================================================
=== Tobias_Chatserver_v7 ; af Tobias, 08/12/2025
Har integreret Henrik_Chatserver_v6 og lidt ekstra i models klasserne.
Arbejdet har egentligt været et fuldt overhaul, så alle klasser er muligvis ændrede.
Tror den eneste klasse der har overlevet er filehandler.js, 
primært fordi der ikke er lavet noget som helst arbejde i den :D
- Slettet messages.json, rykket messages ind i chats.json.
- Nuværende TODOs: 
  - Research og implementer UUID for controller klasserne
  - compareTo metode for beskeder, baseret på messageId.
  - Funktionalitet rettet mod at finde alle beskeder for et givent chatId.
  - Integrere Govhers interface arbejde
  - sign up / opret ny bruger
  - oversigt over brugere for accessLevel 3 users.

  - Måske: kigge på rediger besked funktionalitet

Vi rykker til Github fra nu af, så forhåbentligt er dette den sidste ChangeLog.

================================================================================================================
=== Henrik_Chatserver_v6 ; af Henrik, 08/12/2025
Har også pillet i klasserne med det formål, at beskeder skal gemmes i data/messages.json.
Har også været i messageRoutes og messageController.

================================================================================================================
=== Henrik_Chatserver_v5 ; af Henrik, 07/12/2025
Har prøvet at få chatten til at oprette messages. Man kan logge ind og ud igen.
Klienten findes i public/client/.
Arbejdet krævede ændringer og oprettelse af følgende klasser:
- server side app.js
- middleware 	- auth.js
- routes	- chatRoutes
		- messageRoutes
		- userRoutes
- controllers	- chatController
		- messageController
		- userController
- views		- chat.pug
		- layout.pug
		- login.pug
Messages kan nu oprettes og slettes af ejeren. Skal lige have fjernet rettighederne for brugere på niveau 1.

=== Henrik_Chatserver_v4 ; af Henrik, 02/12/2025
Har prøvet at få chatten til kunne oprette en chat. Siden data skulle gemmes som json, har jeg også måttet ændre
noget kode til database-løsning. Skulle også ændre login, så man kunne se chats på niveau 0.
Arbejdet krævede ændringer og oprettelse af følgende klasser:
- server side app.js
- middleware 	- auth.js
		- requireLogin.js
- routes	- chatRoutes
		- messageRoutes
		- userRoutes
- controllers	- chatController
		- messageController
		- userController
- views		- chat.pug
		- layout.pug
		- login.pug
Chatten ville af en eller anden grund også have placeret client i public-mappen.
- client (js)	- api.js
		- app.js
Men man kan p.t. se en chat, logge ind og oprette en chat.

=== Tobias_Chatserver_v4 ; af Tobias, 28/11/2025
- Har forhåbentligt fikset problemet med unique IDs
- Ændringer i følgende klasser:
  - server\app.js linje 72 til 146, 
    - add a message to chat metoden -> id generering + forklaring dertil 
    - create a new chat metoden -> id generering + forklaring dertil
    - Diverse TODOs, inklusive nogle ting, der gerne må dobbelt-tjekkes.
      - Man kan søge i dokumentet med [ctrl+f], og så skrive 'TODO' i søgefeltet.
  - README.txt
    - Denne tilføjelse til ChangeLog.
- Tænker at gå i gang med at rykke noget funktionalitet fra server\app til controller klasserne næste gang.

=== Tobias_Chatserver_v3 ; af Tobias, 28/11/2025
- Har integreret Govher_Gui, og organiseret server\app.js
- Govher_Gui lavede ændringer i følgende klasser:
  - client\app.js, 
  - server\public\css\style.css && server\public\index.html
  - server\views\chat.pug && server\views\index.pug && server\views\layout.pug && server\views\login.pug

================================================================================================================
===== Git tutorial for projektet =====

-- Start på main og sørg for den er opdateret --

git switch main
git pull

-- Opret en ny branch fra main --

git switch -c navnPåBranch

--- Her arbejder du ---
-- Tilføj filer til commit
 git add .

 -- lav commit -- 
 git commit -m "Opretter kontaktside"

 -- Hvis du vil opdaterer fra main ind i din aktuelle branch --
git checkout navnPåBranch

 -- Hent og merge ændringer fra main til din branch --
git merge main


--- Færdig med at arbejde ---

-- Skift tilbage til main --
git switch main

-- Opdater main for en sikkerheds skyld --
git pull

-- Flet din branch ind i main --
git merge navnPåBranch

-- Push den opdaterede main til GitHub --
git push origin main

-- Slet den nu unødvendige, lokale branch --
git branch -d navnPåBranch

================================================================================================================
