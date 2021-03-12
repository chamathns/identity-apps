/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

export const tomcatSAMLAgentMavenDependencyCode = () => {

    return `<dependency>
    <groupId>io.asgardeo.tomcat.saml.agent</groupId>
    <artifactId>io.asgardeo.tomcat.saml.agent</artifactId>
    <version>0.1.28</version>
</dependency>`;
};

export const wso2InternalRepoPointingCode = () => {

    return `<repositories>
    <repository>
        <id>wso2.releases</id>
        <name>WSO2 internal Repository</name>
        <url>http://maven.wso2.org/nexus/content/repositories/releases/</url>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
        </releases>
    </repository>
</repositories>`;
};

export const tomcatSAMLAgentSamplePropertiesCode = (config: any) => {

    if (!config) {
        return null;
    }

    return `# The URL of the SAML 2.0 Assertion Consumer
SAML2.AssertionConsumerURL=${ config.acsURL }

# A unique identifier for this SAML 2.0 application
SAML2.SPEntityId=${ config.samlIssuer }

# A unique identifier for this SAML 2.0 Identity Provider
SAML2.IdPEntityId=${ config.issuer }

# The URL of the SAML 2.0 Identity Provider
SAML2.IdPURL=${ config.ssoUrl }

# Pem content of the IDP public certificate
IdPPublicCert=${ config.certificate?.replace(/(\r\n|\n|\r)/gm,"")}

# Adanced Properties - Only need to be changed for advanced use cases.

# Url to do send SAML2 SSO AuthnRequest
SAML2SSOURL=samlsso

# URIs to skip SSOAgentFilter; comma separated values
SkipURIs=/<YOU_APP_CONTEXT>/index.html

IndexPage=index.html

ErrorPage=/error.jsp

# Specify if Single Sign on is enabled/disabled
EnableSAML2SSOLogin=true

# Specify if SingleLogout is enabled/disabled
SAML2.EnableSLO=true

# This is the URL that is used for SLO
SAML2.SLOURL=logout

# Specify if SAMLResponse element is signed
SAML2.EnableResponseSigning=false

# Specify if SAMLAssertion element is signed
SAML2.EnableAssertionSigning=false

# Specify if SAMLAssertion element is encrypted
SAML2.EnableAssertionEncryption=false

# Specify if AuthnRequests and LogoutRequests should be signed
SAML2.EnableRequestSigning=false

# Specify if SAML request is a passive
SAML2.IsPassiveAuthn=false

# Password of the KeyStore
KeyStorePassword=<PASSWORD>

# Alias of the SP's private key 
PrivateKeyAlias=<ALIAS>

# Alias of the IdP's public certificate
IdPPublicCertAlias=wso2carbon

# Private key password to retrieve the private key used to sign
# AuthnRequest and LogoutRequest messages
PrivateKeyPassword=wso2carbon`;
};

export const tomcatSAMLAgentSampleWebXMLCode = () => {

    return `<filter>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <filter-class>io.asgardeo.tomcat.saml.agent.SAML2SSOAgentFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>*.jsp</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>*.html</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>/samlsso</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>/logout</url-pattern>
</filter-mapping>

<listener>
    <listener-class>io.asgardeo.tomcat.saml.agent.SSOAgentContextEventListener</listener-class>
</listener>
<context-param>
    <param-name>property-file</param-name>
    <param-value>sample-app.properties</param-value>
</context-param>
<context-param>
    <param-name>certificate-file</param-name>
    <param-value>KEYSTORE_FILE_NAME</param-value>
</context-param>`;
};

export const tomcatSAMLAgentLoginButtonCode = () => {

    return `<form action="home.jsp" method="post">
    <input type="submit" value="log in">
</form>`;
};

export const tomcatSAMLAgentLogoutCode = () => {

    return `<form action="logout?SAML2.HTTPBinding=HTTP-POST" method="get">
    <input type="submit" value="Log Out">
</form>`;
};

export const tomcatSAMLAgentDockerEnvCode = (config: any) => {

    const tomcatHost: string = config.tomcatHost && config.tomcatHost !== ""
        ? config.tomcatHost
        : "<TOMCAT_HOST>";

    return `# The URL of the SAML 2.0 Assertion Consumer
SAML2.AssertionConsumerURL=${ tomcatHost }/sample-app/home.jsp

# A unique identifier for this SAML 2.0 application
SAML2.SPEntityId=${ config.samlIssuer }

# A unique identifier for this SAML 2.0 Identity Provider
SAML2.IdPEntityId=${ config.issuer }

# The URL of the SAML 2.0 Identity Provider
SAML2.IdPURL=${ config.ssoUrl }

# Pem content of the IDP public certificate
IdPPublicCert=${ config.certificate?.replace(/(\r\n|\n|\r)/gm,"")}`;
};
