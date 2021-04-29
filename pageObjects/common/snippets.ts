import { HomePage } from "../homepage"
import { Page } from "playwright"
import { LoggedInHomePage } from "../loggedHomePage"
import { generateRandomNumer } from "../../utils/randomGen"
import { ProjectDetailsPage } from "../projectDetailsPage"

export const logIn = async (username: string, password:string, page: Page): Promise<LoggedInHomePage> => {
    const homePage = new HomePage(page)
    await homePage.navigate()
    await homePage.clickLogIn()
    await homePage.fillLoginForm(username, password)
    return homePage.submitLogInForm()
}

export const createNewProject = async(loggedInHomePage: LoggedInHomePage): Promise<ProjectDetailsPage> => {
    await loggedInHomePage.clickCreateNewProject()
    await loggedInHomePage.fillNewProjectNameForm(generateRandomNumer().toString())
    return loggedInHomePage.submitNewProjectNameForm()
}