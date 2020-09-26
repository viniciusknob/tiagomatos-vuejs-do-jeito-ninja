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
                    <button class="btn btn-success" @click.stop.prevent="getIssues()">GO</button>
                    <button class="btn btn-danger" @click.stop.prevent="reset()">LIMPAR</button>
                </div>
            </div>
        </div>

        <br><hr><br>

        <template v-if="selectedIssue.id">
            <h2>{{ selectedIssue.title }}</h2>
            <div>{{ selectedIssue.body }}</div>
            <a @click.stop.prevent="clearIssue()" href="" class="btn btn-link">Voltar</a>
        </template>

        <table v-if="!selectedIssue.id" class="table table-sm table-bordered">
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
                        <a @click.stop.prevent="getIssue(issue)" href="">
                            {{ issue.number }}
                        </a>
                        <img v-if="issue.is_loading" src="/static/loading.svg" height="20" />
                    </td>
                    <td>{{ issue.title }}</td>
                </tr>
                <tr v-if="!!!this.issues.length && !this.loader.getIssues">
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
    data() {
        return {
            username: '',
            repository: '',
            issues: [],
            selectedIssue: {},
            loader: {
                getIssues: false,
            },
        };
    },
    methods: {
        reset() {
            this.username = '';
            this.repository = '';
        },
        getIssues() {
            if (this.username && this.repository) {
                this.loader.getIssues = true;
                this.issues = [];
                const domain = 'https://api.github.com';
                const url = `${domain}/repos/${this.username}/${this.repository}/issues`;
                axios.get(url)
                    // eslint-disable-next-line no-return-assign
                    .then(response => this.issues = response.data)
                    .finally(() => {
                        this.loader.getIssues = false;
                    });
            }
        },
        getIssue(issue) {
            if (this.username && this.repository) {
                this.$set(issue, 'is_loading', true);
                const domain = 'https://api.github.com';
                const url = `${domain}/repos/${this.username}/${this.repository}/issues/${issue.number}`;
                axios.get(url)
                    // eslint-disable-next-line no-return-assign
                    .then(response => this.selectedIssue = response.data)
                    .finally(() => {
                        this.$set(issue, 'is_loading', false);
                    });
            }
        },
        clearIssue() {
            this.selectedIssue = {};
        },
    },
};
</script>

<style>

</style>
