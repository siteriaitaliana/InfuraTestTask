import { chromium } from 'playwright'
import { expect } from 'chai'
import axios from 'axios'
import { logIn, createNewProject } from './pageObjects/common/snippets'
import { LoggedInHomePage } from './pageObjects/loggedHomePage'
import { ProjectDetailsPage } from './pageObjects/projectDetailsPage'
import axiosRateLimit from 'axios-rate-limit'
import { wait } from './utils/wait'

(async () => {
    console.log(`Starting...`)
    // NOTE: I've set a low 100rps number to reduce amount of errors I'm getting
    // Odd that they are auth errors (401s - "basic auth failure: invalid project id or project secret") more than the expected 429 rate limiter errors
    // tried with a lower rps(10) and get only a handful them
    // but left 100 for test speed of execution reasons
    const http = axiosRateLimit(axios.create(), { maxRPS: 100 })

    const username: string = process.env.USERNAME
    const password: string = process.env.PASSWORD

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    console.log(`Creating a new Infura Ethereum project ID`)
    const loggedInHomePage: LoggedInHomePage = await logIn(username, password, page)
    await loggedInHomePage.clickEthereum()
    const projectDetailsPage: ProjectDetailsPage =  await createNewProject(loggedInHomePage)
    const projectId = await projectDetailsPage.getProjectId()
    expect(projectId).to.not.be.undefined
    expect(projectId).to.not.be.empty
    const projectSecret = await projectDetailsPage.getProjectSecret()
    expect(projectSecret).to.not.be.undefined
    expect(projectSecret).to.not.be.empty
    console.log(`New ProjectId: ${projectId}`)

    console.log(`Getting initial number of requests in new project`)
    await projectDetailsPage.clickRequestTab()
    const currentNumOfRequests = await projectDetailsPage.getCurrentNumOfRequests()
    console.log(`Initial number of requests: ${currentNumOfRequests}`)
    
    console.log(`Fetching 1000 consecutive eth blocks (from 10,000,000 to 10,001,000)`)
    const url = `https://ropsten.infura.io/v3/${projectId}`
    const blocks: number[] = Array.from(new Array(1000), (x, i) => i + 10000000) 
    const payloads = []
    blocks.map((block) => {
        payloads.push({
            jsonrpc:"2.0",
            method:"eth_getBlockByNumber",
            params: [`0x${block.toString(16)}`, false],
            id:1
        })
    })    

    let errors = 0
    await Promise.all(payloads.map(async (p) => {  
        try{
            await http.post(url, p, { auth: {
                username: projectId,
                password: projectSecret
            }, headers: {'content-type' : 'application/json'}})  
        } catch(err){
            errors++
        }
    }))
    console.log(`Tot requests errors: ${errors}`)

    console.log(`Asserting amount of requests is correct`)
    const expectedRequests = 1000 - errors  
    await wait(
        async () => {
            await page.reload()
            let newNumOfRequests = await projectDetailsPage.getCurrentNumOfRequests()
            const diff = parseInt(newNumOfRequests) - parseInt(currentNumOfRequests)
            return diff === expectedRequests
        },
        30000, 1000,
        `Waiting for the request number to be: ${expectedRequests}`
    )
    
    await browser.close()
    // TODO: return non 0 exit code or 0 based on test outcome
})();
