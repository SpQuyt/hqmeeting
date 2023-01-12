import { TypePlace } from './enum';

export type TextContentType =
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode';

export type AutoCompleteType =
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'email'
    | 'name'
    | 'password'
    | 'postal-code'
    | 'street-address'
    | 'tel'
    | 'username'
    | 'off';

export interface IPlace {
    id?: string;
    name?: string;
    lat?: number;
    lng?: number;
    house_number?: string;
    alley?: string;
    lane?: string;
    road?: string;
    district?: string;
    city?: string;
    link_video?: string;
    visited?: boolean;
    false_place?: boolean;
    rating?: number;
    categories?: Array<string>;
    type: TypePlace;
    created_at?: number;
    last_updated_at?: number;
}
export interface IFilter {
    keyword?: string;
    visited?: boolean;
    false_place?: boolean;
    currentCategoriesArr?: Array<{ name: string; isChecked: boolean }>;
}
