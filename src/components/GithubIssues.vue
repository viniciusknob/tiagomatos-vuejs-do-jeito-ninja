<template>
    <div class="container">
        <h1>Vue.js + Github</h1>
        <p class="lead">
            Página que lista issues de um repositório do Github, usando Vue.js.
        </p>

        <div class="row">
            <div class="col">
                <div class="form-group">
                    <input v-model="username"
                        type="text" class="form-control" placeholder="github username">
                </div>
            </div>

            <div class="col">
                <div class="form-group">
                    <input v-model="repository"
                        type="text" class="form-control" placeholder="github repositório">
                </div>
            </div>

            <div class="col-3">
                <div class="form-group">
                    <button class="btn btn-success" @click.stop.prevent="routerPush()">GO</button>
                    <button class="btn btn-danger" @click.stop.prevent="reset()">LIMPAR</button>
                </div>
            </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <br><br>

        <table v-if="!errorMessage" class="table table-sm table-bordered">
            <thead>
            <tr>
                <th width="100">Número</th>
                <th>Título</th>
            </tr>
            </thead>

            <tbody>
                <tr v-if="loader.getIssues">
                    <td class="text-center" colspan="2"><img src="/static/loading.svg" /></td>
                </tr>
                <tr v-for="issue in issues" :key="issue.number">
                    <td>
                        <router-link :to="{
                            name: 'GithubIssue',
                            params: { name: username, repo: repository, issue: issue.number } }">
                                {{ issue.number }}
                        </router-link>
                    </td>
                    <td>{{ issue.title }}</td>
                </tr>
                <tr v-if="issueNotFound">
                    <td class="text-center" colspan="2">Nenhuma issue encontrada!</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'GithubIssues',
    created() {
        this.getIssues();
    },
    data() {
        return {
            username: this.$route.params.name || '',
            repository: this.$route.params.repo || '',
            issues: [],
            errorMessage: '',
            loader: {
                getIssues: false,
            },
        };
    },
    computed: {
        issueNotFound() {
            return !this.issues.length && !this.loader.getIssues;
        },
    },
    methods: {
        routerPush() {
            if (this.username && this.repository) {
                this.$router.push(`/${this.username}/${this.repository}`);
                this.getIssues();
            }
        },
        reset() {
            this.username = '';
            this.repository = '';
        },
        getIssues() {
            if (this.username && this.repository) {
                this.loader.getIssues = true;
                this.issues = [];
                this.errorMessage = '';
                const domain = 'https://api.github.com';
                const url = `${domain}/repos/${this.username}/${this.repository}/issues`;
                axios.get(url)
                    .then((response) => {
                        this.issues = response.data;
                    })
                    .catch((error) => {
                        this.errorMessage = error.message;
                    })
                    .finally(() => {
                        this.loader.getIssues = false;
                    });
            }
        },
    },
};
</script>
