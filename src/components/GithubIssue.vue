<template>
    <div class="container">
        <p v-if="loader.getIssue" class="text-center">
            <img src="/static/loading.svg" />
        </p>
        <div v-if="!loader.getIssue && issue.number">
            <h1>Issue {{ issue.number }}</h1>
            <h3>{{ issue.title }}</h3>
            <div>{{ issue.body }}</div>
            <a href="javascript:history.go(-1)" class="btn btn-link">Voltar</a>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'GithubIssue',
    created() {
        this.getIssue();
    },
    data() {
        return {
            issue: {},
            loader: {
                getIssue: false,
            },
        };
    },
    methods: {
        getIssue() {
            this.loader.getIssue = true;
            const domain = 'https://api.github.com';
            const url = `${domain}/repos/${this.$route.params.name}/${this.$route.params.repo}/issues/${this.$route.params.issue}`;
            axios.get(url)
                // eslint-disable-next-line no-return-assign
                .then(response => this.issue = response.data)
                .finally(() => {
                    this.loader.getIssue = false;
                });
        },
    },
};
</script>
