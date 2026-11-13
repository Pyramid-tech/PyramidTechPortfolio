export function privacyPolicyTemplate(app: string): string {
  return `This privacy policy explains what information the ${app} mobile app collects, how it is used, and the choices you have. ${app} is published by [[legal name of the app publisher]] ("we", "us").

## Information we collect
[[Keep only the lines that apply and describe them accurately. If the app collects nothing, replace this section with: "${app} does not collect, store or share any personal information."]]
- **Account details:** [[for example name, email address, phone number]]
- **Content you provide:** [[for example messages, photos, files]]
- **Device and usage information:** [[for example device model, operating system, app version, crash reports]]
- **Location:** [[approximate or precise location, and when it is collected]]

## How we collect it
We collect this information when you [[create an account, fill in a form, use a feature]] and automatically while you use the app.

## How we use it
- To provide and maintain the features of ${app}.
- To respond to your requests and support questions.
- To keep the app secure and fix problems.
- [[Any other use, such as analytics, notifications or marketing]]

## Who we share it with
We do not sell your personal information. We share it only with the service providers that help us run the app:
- [[Provider name]]: [[what it does, for example hosting, analytics, crash reporting, payments]]

Each of these providers is required to protect your information to the same standard described in this policy.

## How we protect it
Information is sent over encrypted connections and stored with access limited to the people who need it to operate the app.

## How long we keep it
We keep your information for as long as your account is active or as needed to provide the app. [[State any fixed retention period, and anything kept longer for legal or security reasons.]]

## Your choices
- **Access and correction:** you can ask for a copy of your information or ask us to correct it.
- **Withdrawing consent:** you can turn off permissions such as location or notifications in your device settings at any time.
- **Deleting your data:** you can delete your account in the app under [[where the option is]], or ask us to delete it by emailing [[privacy contact email]]. We delete the account and its data within [[number]] days.

## Children
${app} is not directed at children under [[13 or the age that applies]], and we do not knowingly collect their information.

## Changes to this policy
We may update this policy. The date at the top of this page shows when it last changed.

## Contact
Questions about this policy or your information: [[privacy contact email]]
`;
}
