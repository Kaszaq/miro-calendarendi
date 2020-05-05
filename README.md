# Plugin for Miro - Calendarendi

This plugin allows to create calendars which update themselves each day. Each day the previously active day style is copied applied onto a current date box. 
Previous days have style applied the same as day before previously active day. Because of that behaviour this allows for some cool use cases!

## Use cases
There are multiple use cases for use of this plugin. Short showcase can be found here https://www.youtube.com/watch?v=bSJQVUzjopQ&feature=youtu.be

#### Just as normal calendar where you can for instance put your notes on with team members holdays

#### Mark current date on some timeline

#### Mark progress or incoming doom

#### Highlight day of the week in some table

#### Highlight week

#### Highlight month


## Installation
[CLICK HERE](https://miro.com/oauth/authorize/?response_type=token&client_id=3074457347056504522&redirect_uri=https://kaszaq.github.io/miro-calendarendi/installComplete.html) to install plugin in Miro.

## Why

* to easily create a calendar on which we could add cross team notes, like who is on holidays/conference so it would be easily visible next to our kanban board
* to see nicely what is the current date on our project timelines

## Known issues & upcoming features
* currently draws only 3 month forward and one previous, would be better to have this selected by the user
* which timezone is this actually? Code should handle this for instance by setting the timezone in metadata
* would be nice if users could test functionality of changing days somehow using modal on bottom? Otherwise then can only assume, but maybe that is sufficient?
* when a board is opened and day changes it should also update the board date. Currently it is not and date update is triggered only during board open.

## License

Copyright 2020 Michał Kasza

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
