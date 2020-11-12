const UserRepository                    = require('../repositories/userRepository');
const QuestionRepository                = require('../repositories/questionRepository');
const AnswerRepository                  = require('../repositories/answerRepository');
const LinkRepository                    = require('../repositories/linkRepository');
const TagRepository                     = require('../repositories/tagRepository');

module.exports = class SyncBuilder {

    constructor(dbClient) {
        this.db = dbClient;
        this.userRepo = new UserRepository(this.db);
        this.questionRepo = new QuestionRepository(this.db);
        this.answerRepo = new AnswerRepository(this.db);
        this.linkRepo = new LinkRepository(this.db);
        this.tagRepo = new TagRepository(this.db);
    }

    async buildSyncResponse(fromTime=undefined) {
        
        var syncResult = {};
        // Don't include any sensitive data
        var details = {forClient: true};

        syncResult.users = [];
        syncResult.questions = [];
        syncResult.answers = [];
        syncResult.links = [];
        syncResult.tags = [];
        syncResult.tagLinks = [];

        if ( fromTime != undefined ) {
            details.fromTime = fromTime;
        }

        syncResult.users        = await this.userRepo.getUsers(details);
        syncResult.questions    = await this.questionRepo.getQuestions(details);
        syncResult.answers      = await this.answerRepo.getAnswers(details);
        syncResult.links        = await this.linkRepo.getLinks(details);
        syncResult.tags         = await this.tagRepo.getTags(details);
        syncResult.tagLinks     = await this.tagRepo.getTagLinks(details); 

        // There might be nothing to sync
        if ( syncResult.users == null ) {
            syncResult.users = [];
        }
        if ( syncResult.questions == null ) {
            syncResult.questions = [];
        }
        if ( syncResult.answers == null ) {
            syncResult.answers = [];
        }
        if ( syncResult.links == null ) {
            syncResult.links = [];
        }
        if ( syncResult.tags == null ) {
            syncResult.tags = [];
        }
        if ( syncResult.tagLinks == null ) {
            syncResult.tagLinks = [];
        }

        return syncResult;
    }



}