//This property extends the Navigator interface with a contacts property.
//This allows the TS compiler to recognize the contacts property on the navigator object.
//Type IContact can be extended further to include more properties, e.g. email, address, etc.

declare interface Navigator extends NavigatorExtended {}

interface NavigatorExtended {
    readonly contacts: ContactsManager;
}
type IContact = {
    name: string[],
    tel: string[],
}
interface ContactsManager {
    getProperties(): Promise<string[]>;
    select(properties: string[], options?: any): Promise<IContact[]>;
}