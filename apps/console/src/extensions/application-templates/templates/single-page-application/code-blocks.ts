/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SDKInitConfig } from "../../shared";

export const reactSDKInitialisationCode = (SDKInitConfig: SDKInitConfig) => {

    return `import { AuthProvider } from "@asgardeo/auth-react";
import React from "react";
import { render } from "react-dom";
import HomePage from "./pages/home";

const App = () => (
    <AuthProvider
        config={ {
            signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
            signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
            clientID: "${ SDKInitConfig.clientID }",
            serverOrigin: "${ SDKInitConfig.serverOrigin }"
        } }
    >
        { /* Use your own component tree here instead of HomePage.  */ }
        <HomePage />
    </AuthProvider>
);

render((<App />), document.getElementById("root"));`;
};

export const reactSDKIntegrationCode = () => {

    return `import { useAuthContext } from "@asgardeo/auth-react";
import React from "react";

const LandingPage = () => {

    // Use useAuthContext() custom react hook to access auth state and function.
    const { state, signIn, signOut } = useAuthContext();

    return (
        <div>
            <h3>The basic details retrieved from the server upon successful login.</h3>
            <div>
                <ul className="details">
                    <li><b>Name:</b> { state.displayName }</li>
                    <li><b>Username:</b> { state.username }</li>
                    <li><b>Email:</b> { state.email }</li>
                </ul>
            </div>
            <button onClick={ () => signIn() }>Login</button>
            <button onClick={ () => signOut() }>Logout</button>
        </div>
    );
};

export default LandingPage;`;
};

export const javascriptSDKInitialisationCode = (SDKInitConfig: SDKInitConfig): string => {

    return `<script>
// This client is a class and can be instantiated as follows.
var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

// Once instantiated, the  client can be initialized by passing the relevant parameters such as the server origin, redirect URL, client ID, etc.
auth.initialize({
    signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
    signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
    clientID: "${ SDKInitConfig.clientID }",
    serverOrigin: "${ SDKInitConfig.serverOrigin }"
});
</script>`;
};

export const javascriptSDKIntegrationCode = () => {

    return `<script>
// The \`sign-in\` hook is used to fire a callback function after signing in is successful.
auth.on("sign-in", (response) => {
    sessionStorage.setItem("initSignIn", "false");
    alert("You have successfully signed in!");
});

// Use this function in a login button to simply sign-in.
function handleLogin() {
    sessionStorage.setItem("initSignIn", "true");
    // To sign in, simply call the \`signIn()\` method.
    auth.signIn();
}

// Use this function in a logout button to simply sign-out.
function handleLogout() {
    auth.signOut();
}

if(JSON.parse(sessionStorage.getItem("initSignIn"))){
    auth.signIn();
}

</script>`;
};

export const angularSDKInitialisationCode = (SDKInitConfig: SDKInitConfig): string => {

    return `// Import AsgardeoAuthModule and Provide Configuration Parameters.

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

// Import Auth Module
import { AsgardeoAuthModule } from "@asgardeo/auth-angular";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,

        // Add the module as an import providing the configs (See API Docs)
        AsgardeoAuthModule.forRoot({
            signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
            signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
            clientID: "${ SDKInitConfig.clientID }",
            serverOrigin: "${ SDKInitConfig.serverOrigin }"
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
`;
};

export const angularSDKIntegrationCode = (): string => {

    return `import { Component } from "@angular/core";
import { AsgardeoAuthService } from "@asgardeo/auth-angular";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    constructor(private auth: AsgardeoAuthService) { }

    /*
    * Use this function in a login button to simply sign-in.
    */
    handleSignIn(): void {
        this.auth.signIn();
    }

    /*
    * Use this function in a logout button to simply sign-out.
    */
    handleSignOut(): void {
        this.auth.signOut();
    }
}`;
};
