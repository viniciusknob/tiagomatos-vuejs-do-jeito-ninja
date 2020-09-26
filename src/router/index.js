import Vue from 'vue';
import Router from 'vue-router';
import GithubIssues from '@/components/GithubIssues';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'GithubIssues',
            component: GithubIssues,
        },
    ],
});
