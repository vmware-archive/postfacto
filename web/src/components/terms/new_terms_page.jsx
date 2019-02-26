/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import types from 'prop-types';
import RetroFooter from '../shared/footer';

const NewTermsPage = ({config}) => (
  <div id="new-terms" className="terms">
    <div className="simple-text-page">
      <h1>Postfacto Services Agreement</h1>

      <ol start="1">
        <li>Postfacto is the retrospective management tool operated by Pivotal Software, Inc. if you are accessing the Service Offering from the United States or Mexico, or Pivotal Software International if you are accessing from outside the USA and Mexico ("<strong>Pivotal</strong>"
          ). By using or accessing any of the services offered at <a href="https://postfacto.io" target="_blank">https://postfacto.io</a>&nbsp;
          ("<strong>Service Offering(s)</strong>"), you agree to be bound by the terms of use between you and Pivotal (the "<strong>Postfacto Agreement</strong>"
          ) and the <strong>Terms of Use</strong>&nbsp;posted at <a href="https://pivotal.io/terms-of-use" target="_blank">https://pivotal.io/terms-of-use</a>, as may be updated by Pivotal from time to time&nbsp;
          ("<strong>Terms of Use</strong>"), which are incorporated herein by reference. Unless otherwise indicated, capitalized terms have the meaning stated in the Terms of Use. If You do not agree to this Postfacto Agreement, you must not use or access the Service Offering. If you are accepting this Postfacto Agreement on behalf of an Organization (and not for you as individual), you represent and warrant that you have legal authority to bind that Organization, and you hereby enter into this Postfacto Agreement on behalf of that Organization.&nbsp;"You" or "your" means the entity accepting this Postfacto Agreement and the individual accepting this Postfacto Agreement on behalf of the entity.
        </li>

        <li><h2>Definitions</h2>
          <ol>
            <li>"<strong>Confidential Information</strong>" means information, software and materials provided by Pivotal to you, including software, information and materials of third parties, which are in tangible form and labeled "
              confidential" or the like, or, information which a reasonable person knew or should have known to be confidential. The following information shall be considered our Confidential Information whether or not marked or identified as such: login credentials, software, technical information and documentation relating to the Service Offerings that is not otherwise made generally available to the public by Pivotal.
            </li>
            <li><strong>"Content"</strong>&nbsp;means any and all applications, files, information, data, software, or other content uploaded to, published or displayed through the Service Offerings.
            </li>
            <li>"<strong>Login Credentials</strong>"
              mean any passwords, API tokens or other security credentials that enable your access to the Service Offering.
            </li>
            <li>"<strong>Organization</strong>" means the entity that is accepting this Postfacto Agreement.
            </li>
            <li>"<strong>Retro</strong>" means a place to organize and collaborate around information in the form of retro items and action items. Depending on retro access settings, users can view and participate in a retro with or without entering a password.
            </li>
            <li>"<strong>Retro Owner</strong>" means a specific person, identified by their UserID, that has administrative rights to a Retro.
            </li>
            <li><strong>"Retro Participant&quot;</strong>&nbsp;means a specific person that has been given access to view and participate in a Retro via a URL.
            </li>
            <li>"<strong>Relationship Data</strong>" means personal information that we collect during the registration, activation and maintenance of your user profile and/or account. It may include without limitation names and contact details of Your personnel involved in using the Service Offering. Relationship Data does not include information collected through the publicly accessible portions of our webpages, which is subject to the Privacy Policy&nbsp;
              posted at <a href="https://pivotal.io/privacy-policy" target="_blank">https://pivotal.io/privacy-policy</a>.
            </li>
            <li>"<strong>Services Description(s)</strong>" means any description of or information about the Service Offerings made available to you through this site or any usage or access instructions that we provide to you and which we may modify from time to time.
            </li>
            <li>"<strong>Subscription Term</strong>" means the one year time period during which you are provided access to the Service Offerings, which starts on the date you sign up for the Service Offering.
            </li>
            <li>"<strong>Third Party Content</strong>" means third party data, Content, services, or applications, including open source software.
            </li>
            <li>"<strong>Third Party Terms</strong>" means the then-current version of the third-party terms applicable to any Third Party Content.
            </li>
            <li>"<strong>Usage Data</strong>" means information regarding Your use of the Service Offerings, such as application activity, as well as collaborator and retro counts.
            </li>
            <li>"<strong>User</strong>" means an Organization or individual that subscribes to the Service Offering.
            </li>
            <li>"<strong>UserID</strong>" means the email by which you identify your User Profile.</li>
            <li>"<strong>User Profile</strong>" means the your profile information including full name, email and other Login Credentials, provided to us by you and updated by you periodically.
            </li>
            <li>"<strong>Your Content</strong>" means any Content published or displayed through the Service Offerings by you, or your authorized users (or otherwise through your account). Your Content includes Relationship Data, but does not include Usage Data.
            </li>
          </ol>
        </li>

        <li><h2>The Service Offerings</h2>
          <ol>
            <li><strong>Generally</strong>&nbsp;. All access to, and use of, any Service Offerings are subject to the terms and conditions of this Postfacto Agreement. We may deliver the Service Offering to you with the assistance of our affiliates, licensors and service providers. You will comply with all laws, rules and regulations applicable to your use of the Service Offering, Third Party Terms, and the Service Descriptions.
            </li>
            <li><strong>Access to the Service Offering.</strong>&nbsp;You may access and use the Service Offering for solely your own benefit (or the benefit of your Organization). In order to create a retro, You must register for the Service Offering and set up an authorized User Profile. You shall keep your Login Credentials confidential, User Profile accurate, complete and current as long as you continue to use the Service Offering. You may not share Login Credentials with other users. You are responsible for any use that occurs under your Login Credentials. If you believe an unauthorized user has gained access to your Login Credentials, you shall notify us immediately. Neither we nor our affiliates are responsible for any unauthorized access to or use of your account. In order to view and participate in a retro, You do not need a User Profile. You are responsible for managing access settings to the retros you create.
            </li>
            <li><strong>Beta Features.</strong>&nbsp;We may make certain features or functionality within the Service Offering available to you on a beta basis. We provide these beta features and functions on an "
              AS-IS" basis without indemnification or support and disclaim all warranties of any kind (including warranties of merchantability, fitness for a particular purposes, and non-infringement), express or implied. Any beta features or functionality made available to you for evaluation do not constitute an implied commitment to offer to you or anyone such features and functionality as part of the Service Offering on a generally available basis.
            </li>
            <li><strong>Relationship Data.</strong>&nbsp;We may collect Relationship Data. You agree that we may use and disclose Relationship Data to manage your account, send you notifications, deliver services or information, improve and develop new products and services, monitor compliance and provide support. We may further use and share Relationship Data to provide the Service Offering to you, including sharing with our affiliates as described above and entities who provide payment processing and other services to us necessary to enable us to support the Service Offering, and as required by applicable law.
            </li>
            <li>
              <strong>Usage Data.</strong>&nbsp;We may generate, collect, store and use Usage Data for any purpose. You agree that, as between you and Pivotal, Pivotal owns all such Usage Data. By way of example, we use Usage Data to track and manage our infrastructure, network storage, and software for billing, capacity planning and other product forecasting, improvement and development purposes. We may further share Usage Data with our affiliates and third party providers to fulfill our contractual obligations such as software license consumption and reporting. You agree that we may use, analyze, and otherwise perform any operations on or in connection with Relationship Data, Usage Data and Your Content to provide the services to which you have subscribed under this Postfacto Agreement. Without limiting the foregoing, unless prohibited by applicable law, we may aggregate Usage Data such that it is not reasonably identifiable with or to the customer to which it relates ("<strong>Aggregate Data</strong>"
              ). We may use and disclose Aggregate Data for any purpose.
            </li>
            <li><strong>Disclosure of Data and Your Content.</strong>&nbsp;You agree that Pivotal may disclose Your Content, Relationship Data and Usage Data in the following circumstances:
              <ol>
                <li>to our affiliates and other entities of the Pivotal group of companies worldwide for the purposes set forth in this Postfacto Agreement;
                </li>
                <li>to Pivotal&rsquo;s third-party service providers worldwide who provide services such as website hosting, data analysis, payment processing, order fulfillment, information technology and related infrastructure provision, customer service, email delivery, credit card processing, auditing and other similar services;
                </li>
                <li>to a third party in the event of any reorganization, merger, sale, joint venture, assignment, transfer or other disposition of all or any portion of Pivotal&rsquo;
                  s business, assets or stock (including in connection with any bankruptcy or similar proceedings); and
                </li>
                <li>as Pivotal believes to be necessary or appropriate:
                  <ol>
                    <li>under applicable law, including laws outside your country of residence; </li>
                    <li>to comply with legal process;</li>
                    <li>to respond to requests from public and government authorities including public and government authorities outside your country of residence;
                    </li>
                    <li>to enforce this Postfacto Agreement;</li>
                    <li>to protect Pivotal&rsquo;s operations or those of any of its affiliates; </li>
                    <li>to protect Pivotal&rsquo;s rights, privacy, safety or property, and/or that of Pivotal&rsquo;s affiliates, You or others; and
                    </li>
                    <li>to allow Pivotal to pursue available remedies or limit the damages that Pivotal may sustain.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>In case of transfer of your personal data as defined by applicable data privacy laws to outside of the European Economic Area ("<strong>EEA</strong>"
              ) or access of such data from outside the EEA we will apply reasonable legal protection. Such protection may for example include the implementation of European Commission ("<strong>EU</strong>"
              ) Standard Contractual Clauses as published by the EU Commission or our membership to Safe Harbor, an agreement between the U.S. Department of Commerce and the EU Commission for transfers from the EEA to the United States.
            </li>
          </ol>
        </li>

        <li><h2>Your Content</h2>
          <ol>
            <li><strong>Access to Your Content.</strong>&nbsp;You are solely responsible for your Content. We are only acting as a passive conduit for the online distribution and publication of your Content. The Service Offering performs operations on, and distributes, your Content. You and your authorized users retain all of your respective rights, title and interest in and to your Content. Our rights to access and use your Content are limited to those expressly granted in this Postfacto Agreement. No other rights with respect to your Content are implied. In terms of applicable data privacy laws we are acting as a data processor on your (the data controller&rsquo;
              s) behalf regarding your content to the extent it constitutes personal data as per the applicable privacy laws.
            </li>
            <li><strong>Security.</strong>&nbsp;You are responsible for protecting the security of your Content, including any access you might provide to your Content by your employees, customers or other third parties. You will properly configure and use the Service Offering so that it is suitable for your use. You will protect the privacy of any of your users&rsquo;
              data (including by implementation of a privacy policy that complies with applicable law), provide any necessary notices to your users, and obtain any legally-required consents from your users concerning your use of the Service Offering. You are responsible for complying with any laws or regulations that might apply to the your Content and you understand that the Service Offering is not intended for data regulated by the Health Insurance Portability and Accountability Act ("<strong>HIPAA</strong>"
              ). You are responsible for any consequences if your Content is inadvertently exposed or lost and you have not encrypted, backed up or otherwise taken steps required by the relevant laws or regulations to protect your Content. Pivotal will use commercially reasonable efforts to notify you of any inadvertent exposure or loss, taking into account any applicable law, regulation, or governmental request.
            </li>
            <li><strong>Transfer of Your Content.</strong>&nbsp;You consent that we may store your Content in the United States or any other country in which we have a data center in our discretion. By uploading your Content into the Service Offering, you may transfer and access your Content from around the world, including to and from the United States. To the extent you provide your Content in connection with customer support, you consent that we may handle your Content in any country in which we or our agents maintain facilities. It is your responsibility to ensure that you comply with applicable law when you transfer data across geographies.
            </li>
          </ol>
        </li>

        <li><h2>Acceptable Use</h2>
          <ol>
            <li><strong>Content Restrictions.</strong>&nbsp;You will not, and you will take steps to ensure that your authorized users and third party users who access any service you provide with the Service Offering do not, post Content that:
              <ol>
                <li>may create a risk of harm, loss, physical or mental injury, emotional distress, death, disability, disfigurement, or physical or mental illness to an authorized user, or any other person or entity;
                </li>
                <li>may create a risk of any other loss or damage to any person or property;</li>
                <li>may constitute or contribute to a crime or tort;</li>
                <li>contains any information or content that is unlawful, harmful, abusive, racially or ethnically offensive, defamatory, infringing, invasive of personal privacy or publicity rights, harassing, humiliating to other people (publicly or otherwise), libelous, threatening, or otherwise objectionable;
                </li>
                <li>contains any information or content that is illegal; or </li>
                <li>contains any information or content that you do not have a right to make available under any law or under contractual or fiduciary relationships.
                </li>
              </ol>
            </li>
            <li>You represent and warrant that the Content does not and will not violate third-party rights of any kind, including without limitation any Intellectual Property Rights, and rights of publicity and privacy. You shall ensure that your use of the Service Offering complies at all times with your privacy policies and all applicable local, state, federal and international laws and regulations, including any encryption requirements.
            </li>
            <li><strong>Violations of Acceptable Use.</strong>&nbsp;If You become aware that any of your Content or your user&rsquo;
              s use of your Content violates this Postfacto Agreement, you shall immediately suspend or remove the applicable Content or suspend the end user&rsquo;
              s access. If you fail to do so, we may ask you to do so. If you fail to comply with our request, we may suspend your account or disable the applicable Content until you comply with our request.
            </li>
          </ol>
        </li>

        <li><h2>Ownership of Service Offering and Rights to Feedback.</h2>
          <ol>
            <li><strong>Ownership of Service Offering. </strong>We and our licensors own and retain all right, title and interest in and to the Service Offering, including all improvements, enhancements, modifications and derivative works thereof, and all Intellectual Property Rights therein. This includes any information that we collect and analyze in connection with the Service Offering, such as usage patterns, user feedback and other information to improve and evolve our products and services offerings. Your rights to use the Service Offering are limited to those expressly granted in this Postfacto Agreement. No other rights with respect to the Service Offering or any related Intellectual Property Rights are implied.
            </li>
            <li><strong>Feedback</strong>. If you provide comments, suggestions or other feedback to us regarding the Service Offering or Pivotal&rsquo;
              s technology or business (the "<strong>Feedback</strong>"), you agree that we will be free to use any Feedback You provide for any purpose. You hereby grant to us a non-exclusive, perpetual, irrevocable, royalty-free, transferable, worldwide right and license, with the right to grant and authorize sublicenses, to use, reproduce, perform, display, disclose, distribute, modify, prepare derivative works of and otherwise use the Feedback without restriction in any manner now known or in the future conceived and to make, use, sell, offer to sell, import and export any product or service that incorporates or is based in whole or in part on the Feedback.
            </li>
          </ol>
        </li>

        <li><h2>Suspension</h2>
          <ol>
            <li><strong>General</strong>
              <ol>
                <li>you or your use of the Service Offering is in breach of this Postfacto Agreement, including violation of Acceptable Use requirements;
                </li>
                <li>you fail to address our request to take action as specified in Sections 3, 4 or 5;</li>
                <li>your use of the Service Offering poses a security risk to the Service Offering or other users of the Service Offering, or interferes with, disrupts, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of any third party including, but not limited to, Pivotal or any mobile communications carrier; or
                </li>
                <li>suspension is required pursuant to our receipt of a subpoena or other request by a law enforcement agency.
                </li>
              </ol>
            </li>
          </ol>
        </li>

        <li><h2>Term and Termination</h2>
          <ol>
            <li><strong>Term.</strong>&nbsp;This Postfacto Agreement will commence at the point you first access the Service Offering and will be effective through the Subscription Term, unless terminated earlier as permitted under the Postfacto Agreement.
            </li>
            <li><strong>Termination</strong>
              <ol>
                <li><strong>Termination for Cause.</strong>&nbsp;We may terminate this Postfacto Agreement effective immediately if: (a) we determine, in our sole discretion, that any of the provisions of this Postfacto Agreement; (b) you breach a provision of this Postfacto Agreement that is not capable of being cured; (c) you breach any provision of this Postfacto Agreement that is capable of being cured and do not cure the breach within thirty (30) days after receiving an email identifying the breach from us; or (d) any payment is delinquent by thirty (30) days from the due date.
                </li>
                <li><strong>Termination for Insolvency.</strong>&nbsp;We may terminate this Postfacto Agreement effective immediately upon sending you an email notification of termination if you: (a) terminate or suspend your business; (b) become insolvent, admit in writing your inability to pay your debts as they mature, make an assignment for the benefit of creditors; (c) become subject to control of a trustee, receiver or similar authority; or (d) become subject to any bankruptcy or insolvency proceeding.
                </li>
                <li><strong>Termination for Convenience.</strong>&nbsp;We may terminate this Postacto Agreement at any time. You may terminate this Postfacto Agreement at any time by deleting Your user profile by email request to <a href="mailto:postfacto@pivotal.io">postfacto@pivotal.io</a>.</li>
                <li><strong>Effect of Termination.</strong>&nbsp;Upon the termination of this Postfacto Agreement for any reason: (a) all rights granted to you under this Postfacto Agreement, including your ability to access any of Your Content stored in the Service Offering, will immediately terminate; and (b) you must promptly discontinue all access or use of the Service Offering and delete or destroy any of our Confidential Information. For a period of thirty (30) days following the termination, we will not delete your Content as a result of this termination, although you will cease to have access to the Service Offering or Your Content during this period. Free/Open Source Software, Relationship Data, Usage Data, Disclosure of Data and your Content, your Content, Acceptable Use, IP Ownership, Payment and Taxes, Term and Termination, Confidential Information, and Country-Specific Terms, will survive the termination of this Postfacto Agreement.
                </li>
              </ol>
            </li>
          </ol>
        </li>

        <li><h2>General</h2>
          <ol>
            <li><strong>Successors and Assigns</strong>.This Postfacto&nbsp;Agreement may not be assigned without the express written consent of the other party, not to be unreasonably withheld, conditioned or delayed, except that Pivotal may assign or transfer this Postfacto Agreement, in whole or in part, without your consent to any successors-in-interest to all or substantially all of the business or assets of Pivotal whether by merger, reorganization, asset sale or otherwise, or to any subsidiaries or affiliates of Pivotal. Any purported transfer or assignment in violation of this section is void. Subject to the foregoing restrictions, the terms and conditions of this Postfacto Agreement shall inure to the benefit of and be binding upon the respective permitted successors and assigns of the parties.
            </li>
            <li><strong>Compliance with Laws; Export Control; Government Regulations</strong>. Each party shall comply with all laws applicable to the actions contemplated by this Postfacto Agreement. You acknowledge that the Service Offering and all software and technical information relating thereto is of United States origin, is provided subject to the U.S. Export Administration Regulations, may be subject to the export control laws of the applicable territory, and that diversion contrary to applicable export control laws is prohibited. You represent that: (a) you are not, and are not acting on behalf of (i) any person who is a citizen, national, or resident of, or who is controlled by the government of any country to which the United States has prohibited export transactions, or (ii) any person or entity listed on the U.S. Treasury Department list of Specially Designated Nationals and Blocked Persons, or the U.S. Commerce Department Denied Persons List or Entity List; and (b) you will not permit the Service Offering to be used for, any purposes prohibited by law, including, any prohibited development, design, manufacture or production of missiles or nuclear, chemical or biological weapons. If any software or related documentation is licensed to the United States government or any agency thereof, then the such software and documentation will be deemed to be "
              commercial computer software"&#157; and "commercial computer software documentation,"
              respectively, pursuant to DFARS Section 227.7202 and FAR Section 12.212, as applicable. Any use, reproduction, release, performance, display or disclosure of the software and any related documentation by the U.S. Government will be governed solely by this Postfacto Agreement and is prohibited except to the extent expressly permitted by this Postfacto Agreement.
            </li>
            <li><strong>Modifications</strong>. We may change periodically the Service Offering, the terms of your access to the Service Offerings, this Postfacto Agreement, or the Service Description. It is your responsibility to regularly check the Service Offering for updates. We will notify you of any material detrimental change to the Service Offering or Postfacto Agreement by sending you an email or by posting a notice of the modification on the Service Offering. The modified Postfacto Agreement or Service Description, as applicable will become effective as of the date stated in that notification. If we make a material change that is detrimental to You to the Service Offerings (other than the termination or modification of any beta feature or functionality), this Postfacto Agreement, the Service Description, or the Support Policy, you may terminate this Postfacto Agreement on notice to us within ten (10) days of the change or within ten (10) days of our modification notice; in that event, the termination will be effective as of the date we receive your notification. Your continued use of the Service Offering after the effective date of any modification to the Postfacto Agreement, the Service Description, the Third Party Terms, or the Support Policy shall be deemed acceptance of the applicable modification.
            </li>
          </ol>
        </li>
      </ol>

      <p>
        These Terms were last updated on September 1, 2017.
      </p>

    </div>
    <RetroFooter config={config}/>
  </div>
);

NewTermsPage.propTypes = {
  config: types.object.isRequired,
};

export default NewTermsPage;
