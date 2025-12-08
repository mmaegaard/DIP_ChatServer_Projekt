================================================================================================================
===== ChangeLog =====
Skriv her, hvilke klasser, der er ændret siden du sidst sendte noget ind. 
Slet ikke andre beskeder her, vi vil gerne have en nogenlunde tidslinje.
================================================================================================================
=== Henrik_Chatserver_v6 ; af Henrik, 08/12/2025
Prøver at migrere til git

=== Henrik_Chatserver_v6 ; af Henrik, 08/12/2025
Har også pillet i klasserne med det formål, at beskeder skal gemmes i data/messages.json.
Har også været i messageRoutes og messageController.


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
