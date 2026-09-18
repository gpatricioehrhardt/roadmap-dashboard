#!/usr/bin/env node

/**
 * Script para descobrir qual é o projeto Jira correto
 * Uso: node find-project.js <API_TOKEN>
 */

const http = require('http');
const https = require('https');

const API_TOKEN = process.argv[2];
const EMAIL = 'gisele.patricio@carbontech.digital';
const JIRA_SITE = 'carbontech-team.atlassian.net';

if (!API_TOKEN) {
    console.error('Uso: node find-project.js <API_TOKEN>');
    process.exit(1);
}

async function makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString('base64');
        const url = new URL(`https://${JIRA_SITE}/rest/api/3${endpoint}`);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'User-Agent': 'Node.js'
            }
        };

        const request = https.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${data}`));
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Invalid JSON: ${data}`));
                    }
                }
            });
        });

        request.on('error', reject);
        request.end();
    });
}

async function main() {
    try {
        console.log('🔍 Descobrindo projetos Jira...\n');

        // Listar todos os projetos
        const projects = await makeRequest('/project/search?maxResults=50');

        if (!projects.values || projects.values.length === 0) {
            console.log('❌ Nenhum projeto encontrado');
            process.exit(1);
        }

        console.log(`✅ Encontrados ${projects.values.length} projetos:\n`);

        for (const project of projects.values) {
            console.log(`📦 ${project.key} - ${project.name}`);
        }

        console.log('\n🔍 Procurando épicos...\n');

        // Para cada projeto, procurar por épicos
        let totalEpics = 0;
        for (const project of projects.values) {
            try {
                const epics = await makeRequest(
                    `/search?jql=type=Epic AND project=${project.key}&fields=summary&maxResults=50`
                );

                if (epics.issues && epics.issues.length > 0) {
                    console.log(`\n📌 Projeto ${project.key} - ${epics.issues.length} épico(s):`);
                    for (const epic of epics.issues) {
                        console.log(`   • ${epic.key}: ${epic.fields.summary}`);
                        totalEpics++;
                    }
                }
            } catch (error) {
                console.log(`   ⚠️  Erro ao buscar épicos: ${error.message}`);
            }
        }

        if (totalEpics === 0) {
            console.log('\n❌ Nenhum épico encontrado em nenhum projeto');
        } else {
            console.log(`\n✅ Total de épicos encontrados: ${totalEpics}`);
        }

        console.log('\n💡 Use a chave do projeto (ex: CAW, PRJ, etc) no dashboard');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

main();
