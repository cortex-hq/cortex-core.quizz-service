import { Model, Property, Reference, Validator } from "vulcain-corejs";

// -----------------------------------------------------------
// Cortex model
// -----------------------------------------------------------


// -----------------------------------------------------------
// Sport
// -----------------------------------------------------------

// -----------------------------------------------------------
// CarePlan
// -----------------------------------------------------------

// -----------------------------------------------------------
// Exam
// -----------------------------------------------------------




@Model()
export class Game {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "date-iso8601", required: true })
    date: string;
    @Property({ type: "string", required: true })  //TOO : Replace with GeoLoc.
    where: string;
    @Property({ type: "number", required: true, })
    homeScore: number;
    @Property({ type: "number", required: true, })
    awayScore: number;
    @Property({ type: "boolean", required: true })
    completed: boolean;
    @Property({ type: "string", required: true })
    homeTeamId: string;
    @Property({ type: "string", required: true })
    awayTeamId: string;
}

@Model()
export class Interaction {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "number" })
    delay: number;
}


export class Action {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;

    @Property({ type: "string", required: true })
    label: string;
}

export class Interaction2<T> {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "number" })
    delay: number;
    @Reference({cardinality: 'many', item: '?'}) // TODO : Will it be relevant to set this vulcain attribute at this time.
    actions: T[];
}

@Model()
export class Question2 extends Action {
    @Property({ type: "string", required: true })
    type: string;
    @Property({ type: "string", required: true })
    label: string;
    @Property({ type: "boolean", required: false, defaultValue: 'false' })
    required: boolean = false;
}

@Model({extends:'Interaction'})
export class Quizz2 extends Interaction2<Question2> {
}

@Model()
export class Question {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true })
    type: string;
    @Property({ type: "string", required: true })
    label: string;
    @Property({ type: "boolean", required: false, defaultValue: 'false' })
    required: boolean = false;
}

@Model({extends:'Interaction'})
export class Quizz extends Interaction {
    @Property({ type: "number" })
    delay: number;
    @Reference({cardinality: 'many', item: 'Question'})
    question: Question[];
}

@Model({extends:'Interaction'})
export class Activity extends Interaction {
    @Property({ type: "string", required: true })
    type: string;
    @Property({ type: "string", required: true })
    label: string;
}

@Model({extends:'Interaction'})
export class Instructions extends Interaction {
    @Property({ type: "string", required: true })
    type: string;
    @Property({ type: "string", required: true })
    text: string;
}

@Model({description: 'A simple step of a care plan. It can be followed a pre-established plan or scheduling'})
export class Step {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    // @Property({ type: "date-iso8601", required: true })
    // startDate: string;
    // @Property({ type: "date-iso8601", required: true, })
    // endDate: string;
    @Reference({cardinality: 'one', item: 'Interaction'})
    Test: Interaction;
}

@Model()
export class Answer {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", description: 'Set the unique identifiant of the question for which the answer is given.', required: true })
    quizzId: string;
    @Property({ type: "any", required: true })
    value: any;
}

@Model()
export class Exam {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "date-iso8601", required: true })
    startDate: string;
    @Property({ type: "date-iso8601", required: true, })
    endDate: string;
    @Property({ type: "number", required: true })
    score: number;
    @Property({ type: "boolean", required: true })
    completed: boolean;
    @Reference({cardinality: 'one', item: 'Interaction'})
    test: Interaction;
    @Reference({cardinality: 'many', item: 'Answer'})
    answers:Answer[];
}

@Model()
export class PlannedTask {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Reference({cardinality: 'many', item: 'Step'})
    step: Step[];
}

@Model()
export class CarePlan {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    // @Property({ type: "date-iso8601", required: true })
    // startDate: string;
    // @Property({ type: "date-iso8601", required: true, })
    // endDate: string;
    @Reference({cardinality: 'one', item: 'PlannedTask'})
    planner: PlannedTask;
}

@Model()
export class Motivation {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true })
    description: string;
}

@Model({extends:'Motivation'})
export class ConcussionProtocol extends Motivation {
   @Reference({cardinality: 'one', item: 'Game', required: true})
   game: Game;
   @Property({ type: "string", required: true })
   playerId: string;
   @Property({ type: "arrayOf", items:'string', required: true })
   voters: string[];
}

@Model()
export class FollowUp {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "date-iso8601", required: true })
    startDate: string;
    @Reference({cardinality: 'many', item: 'Exam'})
    examens: Exam[];
    @Reference({cardinality: 'one', item: 'CarePlan'})
    carePlan: CarePlan;
    @Reference({cardinality: 'one', item: 'Motivation', required: false})
    motivation: Motivation;
}

// The Player entity is the representation of an user for a dedicated sport and a dedicated team.
@Model()
export class Player {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true })
    sportId: string;
    @Property({ type: "string", required: true })
    teamId: string;
    @Property({ type: "string", required: true })
    userId: string;
    @Property({ type: "number", description: "The position of the player, its jersey number.", required: true })
    number: number;
    @Reference({cardinality: 'many', item: 'Game'})
    hasPlayed: Game[];
    @Reference({cardinality: 'many', item: 'FollowUp'})
    followUps: FollowUp[];
}

@Model()
export class Season {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "date-iso8601", required: true })
    startDate: string;
    @Property({ type: "date-iso8601", required: true, })
    endDate: string;
    @Reference({cardinality: 'many', item: 'Game'})
    games: Game[];
    @Property({ type: "string", required: true })
    sportId: string;
}


@Model()
export class Sport {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true, unique: true })
    label: string;
}

@Model()
export class Coach {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
}

@Model()
export class Team {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true })
    sportId: string;
    @Reference({cardinality: 'many', item: 'Player'})
    players: Player[];
    @Reference({cardinality: 'one', item: 'Coach'})
    coach: Coach;
}

@Model()
export class User {
    @Property({ type: "string", required: true, unique: true, isKey: true })
    id: string;
    @Property({ type: "string", required: true })
    firstName: string;
    @Property({ type: "string", required: true, })
    lastName: string;
    @Property({ type: "date-iso8601", required: true })
    birthday: string;
    @Property({ type: "string", required: true }) // TODO : An Enum
    gender: string;
    @Property({ type: "string" }) // TODO : GeoLoc
    where: string;

    // @Property({ type: "number", required: true })
    // weight: number;
    // @Property({ type: "number", required: true })
    // size: number;
    // It would be archived by a specic Exam entity instance.
}