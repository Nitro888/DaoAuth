const en = [
  {
    title: 'DaoAuth',
    content: `DaoAuth is a decentralized authentication method using a blockchain.`
  },
  {
    title: 'Account',
    content: `
    <strong>Wallet with public address</strong><br/><br/>
      is not possible to respond to leakage of the private key,<br/>
      When transferring to another person, there is a problem of mutual trust,<br/>
      The disadvantage is that if the address is changed by changing the key, the asset can not be transferred to the new address.<br/><br/>
    <strong>An account created by DaoAuth</strong><br/><br/>
      As users change their passwords, users can change their keys at any time, <br/>
      So, even with transfer issues, the problem of trust disappears. <br/>
      You do not have to worry about transferring assets because you can not change the address even if you change the key.<br/><br/>`
  },
  {
    title: 'Issuer',
    content: `The user who created the account directly from DaoAuth is called the Issuer.<br/>
    Issuers can generate accounts at the request of users. <br/>
    At this time, the issuer can ask for information on e-mail, telephone number, and other <strong>KYC & AML</strong> in return for creating an account. <br/>
    This means that accounts created by issuer who require high-level information can gain a high degree of trust in the transaction.`
  },
  {
    title: 'User',
    content: `Who create accounts through an issuer are called users. <br/>
    You will then be able to sign up for DaoAuth services using this account.`
  }
]

export default en
