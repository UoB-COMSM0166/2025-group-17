# 2025-group-17
2025 COMSM0166 group 17
## Your Game

[Link to our game!](https://uob-comsm0166.github.io/2025-group-17/public/)

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)


## Your Group

![group-photo.jpg](images/group-photo.jpg)</br>

| Name | GitHub Profile | Email | Role |
|-|-|-|-|
| Yishan Chen  | [shandy-del](https://github.com/shandy-del)         | sf24245@bristol.ac.uk   | role |
| Yuetong Dong | [Catherinett-111](https://github.com/Catherinett-111) | wv24137@bristol.ac.uk   | role |
| Shuzhou Huang| [EnjoyerGG](https://github.com/EnjoyerGG)           | uq24650@bristol.ac.uk   | role |
| Hong Jin     | [h-d-jin](https://github.com/h-d-jin)               | sd24459@bristol.ac.uk   | role |
| Yuzheng Li   | [Kkan6](https://github.com/Kkan6)                   | nb24046@bristol.ac.uk   | role |
| Zhexing Yang | [ZhexingYoung](https://github.com/ZhexingYoung)     | ec24179@bristol.ac.uk   | role |


## Kanban Board
https://www.notion.so/1827d976fa2680a4b440cbe594a6a63d?v=1827d976fa26807b9c51000c642e4ac8&pvs=4

## Project Report

### Introduction


Our game *Out* is inspired by *The Binding of Isaac*, a well-known 2D action-adventure and RPG platformer created by Edmund McMillen. Like the original, players move through a series of thoughtfully designed levels and enemies, using projectile-based combat to fight monsters in different dungeon settings, gaining points and gradually uncovering the story.

But *Out* adds several unique features that set it apart. On top of the familiar gameplay, we’ve introduced a system of procedurally generated obstacles and a timer mechanic. These additions are designed to encourage players to replay the game, pushing themselves to beat their previous times and enjoy the process of self-improvement through challenge.

Artistically, the game features original hand-drawn visuals that help tell the story more immersively. In the end, we hope *Out* can be more than just a fun game—it’s also meant to be a space for reflection, where players might see parts of their own experiences echoed in the journey.

### Requirements 

<!-- - 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop? -->
<!-- Early stages design & Ideation process -->
We started the ideation process by exploring games on the markets in Week 1 and came up a list of possible game mechanisms and ideas. After brainstorming and discussion in Week 2, we narrowed down the list to two ideas below. Despite the rest of the game ideas have not been prototyped, the mechanisms extracted from them, such as using random events to improve users' engagement, have set the foundation for the finalised game. Finally, we considered the feasibility of implementation, and the feedback gained from other teams during the workshop in Week 3. As a result, we decided to go with an action advantage game similar to The Binding of Isaac.

Prototype Ideas Video
https://youtu.be/wU7b8NAj1_g?si=eox95n0rkYJhKN4H

<!-- TODO: Finalised two ideas -->
| Game Idea | Inspried by | Game Mechanisms | Possible Challenges |
|-|-|-|-|
| Out | The Binding of Isaac | <ul><li> Players aim to reach the end of each level to complete the game </li><br><li> Random items/events will give players unique abilities </li><br><li> Save point enables players to reload the save data when they died </li></ul> | <ol><li> Careful design for collision detection to replicate the experience of the original game. </li><br><li> Make sure each level is unique and has a reasonable difficulty curve </li></ol> |
| Majhontro | Balatro | <ul><li> Players aim to score higher points by different combinations of the current tiles </li><br><li> Boss levels introduce restrictions on card playing or drawing </li><br><li> Random tile generation ensures the game replayability </li></ul> | <ol><li> Replace suit logic with a Mahjong tile </li><br><li> Design tile combination and rules for bonus points </li></ol> |

<!-- TODO: Onion Model Diagram -->
<!-- TODO: Use case diagram -->

<!-- Reflection on requirement engineering -->
During the workshop in Week 4, we explored the process of requirement engineering by identifying various stakeholders and determining their expectations. To estimate the user value of our game, we utilized the onion model to hierarchically consider stakeholders and gather potential requirements beyond our team's initial scope. Outlining the epics and user stories helps us break them into smaller, manageable tasks, specifying what the team should build in each sprint cycle. This approach ensures clear and measurable requirements, detailing the time and effort required from the development team. By assigning smaller tasks to each team member, we minimize the impact of adjustments, keeping our team agile and adaptable. We also consider the diverse needs of different users, which allows each team member to focus on independent and achievable goals, thereby reducing the risk associated with complex objectives. The acceptance criteria are crucial for identifying deliverable outcomes and prioritizing solutions that work for most people. Furthermore, communicating requirements within the team enhances our ability to gather feedback among the team members and reflect on changes before modifying the actual code. With the help of it, we can be more flexible to the demands that change frequently, which fits the spirit of agile development.

#### Epic and User Stories
**Epic 1: Players with different gaming experiences**

As a player,
I want to get inspired and relax during the gameplay,
so that I can enjoy the game regardless of my previous gaming experiences.

| User Story | Acceptance Criteria |
|-|-|
| As a **casual player**, I want to save my game progress frequently, so that I can return to play without losing significant progress. | Given the player reaches the end of each sub-level, When the player passes by a save point, Then the game saves the current progress and provides a confirmation message. |
| As an **explorer player**, I want to explore all the easter eggs and gain all the achievements, so that I can explore every interesting aspect and experience of this game. | Given the player reaches the optional challenge level/room, When the player beats all the enemies in this room, Then they would gain different skill sets or bonus points. |
| As a **competitive player**, I want to see trackers for my performance, so that I can compare with other players. | Given the player completes all the levels, When the end screen is displayed and the user enters their username, Then the player’s name and score are shown along with their rank on the leaderboard for that level.
| As a **new player**, I want to learn the basic controls and terminologies, so that I can quickly learn how to play without frustration. | Given the game is started for the first time, When the user selects "New Game", Then an interactive tutorial provides step-by-step guidance on moving, jumping, and collecting items. |
| As a **story seeker**, I want to meet all the items and unlock all the elements of the game. | Given the player has finished all the levels, When every time play the game, Then new grap of the game will be achieved. |

**Note**: The potential stakeholders are marked as **bolded** above.

Onion Model
![onion-model.png](images/onion-model.png)</br>

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 
![class-diagram.svg](images/class-diagram.svg)</br>
![sequence-diagram.svg](images/sequence-diagram.svg)</br>

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation
## Qualitative Evaluation - Heuristic Evaluation

| Name | Interface | Issue | Heuristic(s) | Freguency 0 (rare) to 4 (common) | Impact 0 (easy) to difficult (4) | Persistence 0 (once) to 4 (repeated) | Severity = Sum Total of F+I+P/3 |
|----------|----------|----------|----------|----------|----------|----------|----------|
| Hsinyun Fan | Tutorial Interface | Don't know when player is attacked by enemies. | Visibility of system status | 2 | 2 | 0 | 1.25 |
| Kailin Fang | Tutorial Interface | Instruction could be more clear (like use picture to show). | Help and documentation | 1 | 2 | 1 | 1.33 |
| Daisy Fan | Tutorial Interface | Can pop up instruction first then begin. The HP not very clear. | Help and documentation | 1 | 2 | 1 | 1.33 |
| Brian | Tutorial Interface | Don't know how to win or play when just eneter the game. | Visibility | 1 | 4 | 1 | 2 |
| Kaijie Xu | "Playing" Interface | Player identification | Recognition rather than recall. | 2 | 2 | 4 | 2.67 |
| Rowan | Pause Menu | Hard to see the pause button | Visibility of system status, Consistency and standards, Error prevention, Recognition rather than recall, Flexibility. | 1 | 1 | 0 | 0.67 |
| Rowan | "Playing" Interface | Difficult to avoid enemies | Visibility of system status, Consistency and standards, Error prevention, Recognition rather than recall, Aesthetic | 4 | 3 | 2 | 3 |
| Aya | "Playing" Interface | Hard to defeat enemy, takes many shoots | Flexibility and efficiency of use | 2 | 3 | 2 | 2.33 |
| A | "Playing" Interface | I'm not used to operating keys. The display of the player's health is not very obvious and is not easy to see at a glance. | User control and freedom. | 1 | 0 | 1 | 0.67 |
| A | "Playing" Interface | The monster is moving too fast. It is better to show the monster's health. | User control and freedom. | 2 | 2 | 1 | 1.67 |
| James | Tutorial Interface, "Playing" Interface | It’s a little bit hard for recognize the tutorial image of the first level. | Visibility of system status, Flexibility and efficiency of use | 2 | 2 | 1 | 1.67 |
| James | "Playing" Interface, Game Over Interface | Hard game and hard to find the button to restart the game. | User control and freedom, Recognition rather than recall | 3 | 3 | 3 | 3 |
| Farid | "Playing" Interface | Bullet is a bit too slow | Visibility of system status, Flexibility and efficiency of use | 3 | 2 | 3 | 2.67 |
| Jacque | "Playing" Interface | Collision with box, health visibility | User control and freedom, Aesthetic and minimalist design | 2 | 0 | 3 | 1.67 |
| Ziqi | "Playing" Interface |  | User control and freedom | 2 | 2 | 1 | 1.67 |
| Hao | Start Menu | The playing button is too small | Aesthetic and minimalist design  | 1 | 2 | 1 | 1.33 |
| Beam | "Playing" Interface | Collision detection is a bt off | User control and freedom | 4 | 3 | 1 | 2.67 |
| Marek | "Playing" Interface | Too small buttons starts very quickly, once you play it more bcomes easier  | Visibility of system status, User control and freedom  | 1 | 1 | 3 | 1.67 |
| Oliver | "Playing" Interface | Enemies can phase through the obstacles in the level, which is unintuitive that the player can't either. The hitboxes are quite tight which can halt movement if you're colliding with 1 pixel | User control and freedom  | 1 | 1 | 3 | 1.67 |
| Luciano | Pause Menu, "Playing" Interface | Sometimes movement didn't work. Obstacle location being random each time can make level 3 easier than level 1. | User control and freedom, Aesthetic and minimalist design  | 2 | 3 | 4 | 3 |
| Alexandros | "Playing" Interface | The hitboxes on the blue computers were a bit too big | Flexibility and efficiency of use  | 3 | 1 | 4 | 2.67 |
| Ashby | "Playing" Interface | The obstacles looked smaller than they actually were. It was a bit easy to just spam attack.  | User control and freedom, Consistency and standards, Flexibility and efficiency of use  | 2 | 1 | 3 | 2 |
| Asher | "Playing" Interface | Hitboxes too large, not obvious that music notes stop when they hit obstacles, cannot move left or right when also moving into an obstacle, saving is not clear | Visibility of system status, User control and freedom, Consistency and standards, Flexibility and efficiency of use, Help users recognise, diagnose, and recover from errors | 4 | 3 | 0 | 2.33 |
| gg | Start Menu |  | Flexibility and efficiency of use | 1 | 3 | 1 | 1.67 |


*Heuristic Evaluation Results*

We conducted two questionnaire collection activities. A total of 24 feedback from 21 students were collected, which is shown in the above table.

| **Category**                           | **Manifestation**                                                                                                                                 | **Impact**                                                                                      | **Suggested Improvement**                                                                                      |
|----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **Lack of Visibility of System Status** | - Players don’t know when they are attacked.  <br> - Health display is unclear. <br> - Bullets are too slow, lack timely feedback. <br> - Enemy health is invisible. | Makes it hard for players to understand game status, leading to frustration.                   | Enhance UI elements like health bars and attack indicators to improve real-time feedback.                      |
| **Insufficient User Control and Feedback** | - Unresponsive or unintuitive key controls. <br> - Movement restrictions (e.g., stuck on collisions, can't move sideways). <br> - High difficulty, restart button hard to find. <br> - Unclear saving system. | Reduces sense of control, potentially causes players to quit.                                   | Provide clear control prompts, customizable keys, and visible retry/exit buttons.                             |
| **Lack of Help and Documentation**     | - Tutorial is unclear or disorganized. <br> - Players don’t know how to start or win the game.                                                   | High entry barrier, poor tutorial experience.                                                  | Use visuals, step-by-step popups, and task hints to enhance guidance.                                         |
| **Inconsistency & Aesthetic Issues**   | - Buttons are too small or not noticeable. <br> - Visual and actual collision of obstacles are inconsistent. <br> - Enemies or obstacles are too fast to react. | Reduces interface usability and predictability.                                                | Unify visual style, optimize hitboxes, and highlight interactive elements.                                     |
| **Recognition Over Recall**            | - Players can't easily identify their character or elements. <br> - Difficult to remember how to restart or continue the game.                    | Increases cognitive load by requiring memory instead of recognition.                           | Strengthen visual cues, add icons and labels to assist recognition.                                           |


*Usability Issues and Suggested Improvements in Game Design*

The feedback of personal user experience is concluded and classified into five categories with each category has various manifestation, suggested improvement, and impact as shown in the above table.

## Quatitative Evaluation - System Usability Survey (SUS)

| User ID | I think I would like to use this system frequently | I found the system unnecessarily complex | I thought the system was easy to use | I think that I would need the support of a technical person to be able to use this system | I found the various functions in this system were well integrated | I thought there was too much inconsistency in this system | I would imagine that most people would learn to use this system very quickly | I found the system very cumbersome to use | I felt very confident using the system | I needed to learn a lot of things before I could get going with this system |
|---------|-----------------------------------------------------|------------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------|-------------------------------------|------------------------------------------------------------------------------------|
| User 01 | 4                                                   | 1                                        | 4                                    | 1                                                                                                | 5                                                                      | 2                                                            | 4                                                                                       | 2                                        | 5                                   | 1                                                                                  |
| User 02 | 4                                                   | 1                                        | 4                                    | 1                                                                                                | 5                                                                      | 2                                                            | 4                                                                                       | 2                                        | 5                                   | 1                                                                                  |
| User 03 | 5                                                   | 1                                        | 5                                    | 1                                                                                                | 3                                                                      | 1                                                            | 5                                                                                       | 3                                        | 5                                   | 5                                                                                  |
| User 04 | 4                                                   | 3                                        | 3                                    | 3                                                                                                | 3                                                                      | 3                                                            | 3                                                                                       | 3                                        | 3                                   | 3                                                                                  |
| User 05 | 4                                                   | 2                                        | 4                                    | 3                                                                                                | 3                                                                      | 3                                                            | 3                                                                                       | 3                                        | 3                                   | 2                                                                                  |
| User 06 | 4                                                   | 3                                        | 4                                    | 3                                                                                                | 3                                                                      | 3                                                            | 3                                                                                       | 3                                        | 3                                   | 3                                                                                  |
| User 07 | 5                                                   | 1                                        | 5                                    | 4                                                                                                | 5                                                                      | 1                                                            | 4                                                                                       | 3                                        | 5                                   | 2                                                                                  |
| User 08 | 3                                                   | 3                                        | 4                                    | 3                                                                                                | 4                                                                      | 3                                                            | 2                                                                                       | 3                                        | 2                                   | 4                                                                                  |
| User 09 | 5                                                   | 3                                        | 5                                    | 2                                                                                                | 5                                                                      | 1                                                            | 2                                                                                       | 3                                        | 5                                   | 1                                                                                  |
| User 10| 4                                                   | 2                                        | 3                                    | 3                                                                                                | 5                                                                      | 3                                                            | 4                                                                                       | 3                                        | 4                                   | 2                                                                                  |
| User 11| 4                                                   | 2                                        | 2                                    | 4                                                                                                | 5                                                                      | 2                                                            | 3                                                                                       | 2                                        | 2                                   | 2                                                                                  |


*SUS Results of Easy Mode*



| User ID | I think I would like to use this system frequently | I found the system unnecessarily complex | I thought the system was easy to use | I think that I would need the support of a technical person to be able to use this system | I found the various functions in this system were well integrated | I thought there was too much inconsistency in this system | I would imagine that most people would learn to use this system very quickly | I found the system very cumbersome to use | I felt very confident using the system | I needed to learn a lot of things before I could get going with this system |
|---------|-----------------------------------------------------|------------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------|-------------------------------------|------------------------------------------------------------------------------------|
| User 01 | 4 | 1 | 3 | 1 | 4 | 1 | 5 | 2 | 4 | 1 |
| User 02 | 4 | 1 | 4 | 1 | 5 | 2 | 4 | 2 | 5 | 1 |
| User 03 | 5 | 1 | 5 | 5 | 5 | 3 | 5 | 3 | 5 | 3 |
| User 04 | 3 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 2 | 4 |
| User 05 | 3 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 2 | 3 |
| User 06 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 2 |
| User 07 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 |
| User 08 | 2 | 4 | 2 | 5 | 2 | 5 | 2 | 4 | 2 | 3 |
| User 09 | 5 | 2 | 5 | 1 | 5 | 1 | 5 | 3 | 5 | 1 |
| User 10 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 |
| User 11 | 3 | 2 | 2 | 5 | 4 | 2 | 1 | 4 | 2 | 2 |


*SUS Results of Hard Mode*


| User ID | Easy Mode | Hard Mode |
|---------|------------|------------|
| User 01 | 87.5       | 85.0       |
| User 02 | 92.5       | 70.0       |
| User 03 | 80.0       | 75.0       |
| User 04 | 60.0       | 40.0       |
| User 05 | 65.0       | 45.0       |
| User 06 | 70.0       | 65.0       |
| User 07 | 87.5       | 80.0       |
| User 08 | 55.0       | 35.0       |
| User 09 | 80.0       | 92.5       |
| User 10 | 67.5       | 55.0       |
| User 11 | 60.0       | 42.5       |


*Statistical testing (Wilcoxon sign-ranked test) Results*


Higher SUS scores indicate better perceived usability. The Easy Mode has higher usability score than that of the Hard Mode, suggesting that users found the game more intuitive and accessible in Easy Mode. We conducted the Wilcoxon signed-rank test on the SUS data. The results show obvious significance. For a group of 11 participants, the calculated test statistic W is 5.5, which indicates that the significance level reached 0.025, or 97.5% according to the critical values table. The result determined that there was an significant difference between the easy mode and hard mode. However, this result does not determine exactly what causes the difference between the two modes. This uncertainty about whether there is really a difference in the usablity of two modes is related to one or more items of SUS.


| SUS Item                                                                                 | Easy | Hard |
|-----------------------------------------------------------------------------------------------|------|------|
| I think I would like to use this system frequently                                            | 4.2  | 3.6  |
| I found the system unnecessarily complex                                                      | 2.0  | 2.4  |
| I thought the system was easy to use                                                          | 3.9  | 3.3  |
| I think that I would need the support of a technical person to be able to use this system     | 2.6  | 3.1  |
| I found the various functions in this system were well integrated                             | 4.1  | 3.5  |
| I thought there was too much inconsistency in this system                                     | 2.3  | 2.5  |
| I would imagine that most people would learn to use this system very quickly                  | 3.4  | 3.3  |
| I found the system very cumbersome to use                                                     | 2.5  | 3.1  |
| I felt very confident using the system                                                        | 3.8  | 3.4  |
| I needed to learn a lot of things before I could get going with this system                   | 2.4  | 2.3  |

*The average score of each item on the scale is of the easy mode and the difficult mode*


The average scores of the easy mode and the hard mode are 73.2 and 62.3 respectively. The latter is lower than the general usability benchmark of 68. Based on the results of the above table, we decided to improve the control methods of the player, the collision logic between classes, and the UI design of non-game interfaces to enhance the integrity of the hard mode system and make it easier for users to master and proficiently use the game system with the expectation of bringing the usability score of hard mode to the 68 benchmark.



- Description of how code was tested.



### Process 


---

### Team Collaboration and Workflow

At the beginning of the project, we held collaborative discussions to define the core game states necessary for a minimum viable product and potential extended features that could be added later in the development cycle. In hindsight, our progress could have benefited from a clearer overall structure regarding functionality planning and workflow management early on. A more refined understanding of the software requirements and a better-coordinated development pipeline might have streamlined our implementation process.

We maintained regular in-person meetings in the Software Engineering lab throughout the development period. These weekly sessions provided an opportunity to check progress, align tasks, and address any technical or design issues that emerged. Our communication was effective and enjoyable, significantly contributing to team morale and productivity. For day-to-day coordination, we relied heavily on a WeChat group chat. This channel allowed us to share quick updates, raise unexpected issues, and propose small changes in real-time. For more formal discussions, especially those involving critical decisions or feature planning, we used Microsoft Teams and recorded key meetings to ensure that important information could be reviewed later when needed.

### Tools and Technologies

**Project Management Tools:**  
We used GitHub for version control and collaborative coding. Each team member worked on individual feature branches—for example, a dedicated branch was created solely for the menu state. The main branch was always kept stable to ensure that we always had a functioning build available. GitHub’s protection features, including pull requests, allowed us to thoroughly review and test each other’s contributions before merging. This improved code quality helped prevent merge conflicts and maintained consistency in implementing features.

Given the complexity of our game, which involved multiple interconnected game states, we adopted Notion as our project management tool. Notion enabled us to track progress on various tasks, delegate responsibilities, and visualize our workflow clearly. We divided work based on game modules and assigned responsibilities accordingly. In retrospect, we realized that we could have further broken down larger tasks into smaller sub-tasks—such as dividing the development of the shop state into UI design, game logic, and asset integration. This would have given us a more granular understanding of our progress and helped balance the workload more effectively.
![微信截图_20250412140536](https://github.com/user-attachments/assets/fc33d177-d199-4be4-b140-9c36fdd7c5b3)

**Development Tools:**  
For the core of our game development, we used **P5.js**, a JavaScript-based creative coding framework that supports dynamic rendering and a wide variety of extension libraries. Early on, we encountered some difficulties with debugging and extending functionality using P5.js, particularly since many team members were unfamiliar with it. However, through collaboration and consistent practice, we overcame these challenges and gained proficiency, which accelerated the later stages of development.

Regarding visual design, team member **Shuzhou Huang** led the creation of all original artwork. Using **Aseprite**, a pixel art tool, he designed characters, backgrounds, UI components, and animations, all by hand. These assets contributed significantly to the game’s unique aesthetic and atmosphere.

We sourced royalty-free audio from public platforms for sound design and then processed and edited the sound effects using **Logic Pro X**. This allowed us to fine-tune the quality and timing of audio elements, enhancing the overall immersion of the game.
![d8e7d67450a08bffac6aacd4a66122e](https://github.com/user-attachments/assets/16c0db61-2bbc-47ef-abbd-c04069e6d9dd)

###  Sustainability, Ethics and Accessibility
#### Green Software Foundation Implementation Patterns Applied in the Project
1. Efficient Asset Management
   - **Pattern**: Properly Sized Images  
   - **Specific Application**:
     - In the project, various game elements such as player, enemies, bullets, and background images are used. By optimizing these images' resolution and size, unnecessary high-resolution images are avoided, reducing memory usage and loading time. In the `preload.js` file, many game resources (e.g., `shooterImage`, `chaserImage`, `bulletImage`) are loaded in an efficient way. 
     - The function `adjustCanvasWithAspectRatio` in `hud.js` adjusts the canvas size based on the aspect ratio of the screen. This method adapts and resizes the game screen when the window size changes, preventing unnecessary image stretching or scaling, further reducing rendering resource waste.
     - **Performance Impact**: This approach reduces unnecessary image loading, speeds up loading times, and minimizes memory consumption. It also reduces server load, which helps in lowering overall energy consumption【67†source】【16†source】.

2. Event-Driven Architecture
   - **Pattern**: Event-Driven and Modular Code  
   - **Specific Application**:
     - In `EventBus.js`, an event-driven architecture is implemented. This allows seamless transitions between different game states (e.g., from the main menu to the game, from pause to resume). For example, by publishing (`publish`) and subscribing (`subscribe`) to events, `GameStateManager.js` listens for different events such as `START_NEW_GAME`, `PAUSE_GAME`, etc., and responds accordingly. This makes the game logic more modular, reducing coupling between different modules and making the system easier to maintain and extend.
     - **Performance Impact**: Event-driven architecture decouples different components, ensuring that resources are only loaded or updated when necessary, avoiding unnecessary computations and resource consumption. For instance, when the game is paused, only `GameStateManager` needs to update the game state, while other modules (such as enemies, player, etc.) do not perform unnecessary computations, reducing CPU load and saving energy【14†source】【69†source】.

3. Performance Optimization and Caching
   - **Pattern**: Efficient Memory Usage and Caching  
   - **Specific Application**:
     - In `SavePoint.js` and `GameStateManager.js`, caching mechanisms are used to store the game progress. For example, when the player approaches a save point, the game state is saved (`saveGameData`), and this data is stored in the browser's `localStorage`, preventing the game from reloading from scratch each time. This mechanism reduces unnecessary reloading and computations, improving the game's responsiveness and performance.
     - Furthermore, in `Room.js`, enemies and obstacles are generated dynamically based on the current room data. This reduces the initialization time for each room, ensuring that game data is only loaded and computed when the player enters a room. For larger games, dynamically loading resources instead of loading everything at once significantly reduces memory consumption and improves performance.
     - **Performance Impact**: By storing and caching game states, unnecessary data reloads are avoided, improving performance and saving bandwidth and memory. Especially in web games, caching player progress in `localStorage` reduces server load and the need for data transmission, optimizing overall energy efficiency.





### Contributions

| Name          | Role / Responsibility           | Contributions          |
|---------------|---------------------------------|------------------------|
| Yishan Chen   | Game logic & system integration |           X            |
| Hong Jin      | Game logic & UI                 |           X            |
| Yuetong Dong  | Testing & sound load            |           X            |
| Yuzheng Li    | Game logic & report             |           X            |
| Shuzhou Huang | Visual art & pixel assets       |           X            |
| Zhexing Yang  | Sound design & story script     |           X            |

---

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

<!-- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout? -->
