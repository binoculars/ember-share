import Ember from 'ember';
import langs from 'npm:langs';
import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

    buildQueryObject(selected) {
        let key = this.get('key');
        let languageCodes = selected.map((lang) => {
            return langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3'];
        });

        let newFilter = termsFilter(key, getUniqueList(languageCodes), true);
        return [newFilter, languageCodes];
    },

    selected: Ember.computed('state', function() {
        let params = this.get('state');
        let languageCodes =  params ? params : [];
        let languageNames = languageCodes.map((lang) => {
            return langs.where('3', lang)['name'];
        });
        return languageNames;
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            let [filter, value] = this.buildQueryObject(languageNames);
            this.sendAction('onChange', key, filter, value);
        }
    }
});
