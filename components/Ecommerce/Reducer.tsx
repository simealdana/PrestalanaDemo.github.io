const initState = {
    relatedItems: [],
    categories: [],
    itemsDetail: null,
    updated: false,
    search: null,
    familyId: 0,
    pageNumbrer: 1,
    amountSeparate: 0,
    amountPurchase: 0,
    totalAmountSeparate: 0,
    list: [],
    nonWorkingDays: [],
    isHistory: false,
    isInformation: false,
    clientName: "",
    ecommerceParameters: [],
    listItemsToBuy: [],
    listItemsToSeparate: [],
    separatedIds: [],
    newValue: 0,
    totalValue: 0
}

const ecommerceReducer = (state = initState, action) => {
    switch (action.type) {
        case "UPDATE_NEW_VALUE":
            return {
                ...state,
                newValue: action.payload
            }
        case "UPDATE_TOTAL_VALUE":
            return {
                ...state,
                totalValue: action.payload
            }
        case "UPDATE_LIST_SEPARATED_IDS":
            return {
                ...state,
                separatedIds: action.payload
            }
        case "UPDATE_LIST_ITEMS_TO_BUY":
            return {
                ...state,
                listItemsToBuy: action.payload
            }
        case "UPDATE_LIST_ITEMS_TO_SEPARATE":
            return {
                ...state,
                listItemsToSeparate: action.payload
            }
        case "UPDATE_ECOMMERCE_PARAMETERS":
            return {
                ...state,
                ecommerceParameters: action.payload
            }
        case "UPDATE_CLIENT_NAME_TO_SEARCH":
            return {
                ...state,
                clientName: action.payload
            }
        case "UPDATE_RELATED_ITEMS":
            return {
                ...state,
                relatedItems: action.payload
            }
        case "UPDATE_CONDITION":
            return {
                ...state,
                updated: action.payload
            }
        case "SET_CATEGORIES":
            return {
                ...state,
                categories: action.payload
            }
        case "UPDATE_SEARCH":
            return {
                ...state,
                search: action.payload
            }
        case "UPDATE_FAMILY_ID":
            return {
                ...state,
                familyId: action.payload
            }
        case "UPDATE_ITEMS_DETAIL":
            return {
                ...state,
                itemsDetail: action.payload
            }
        case "UPDATE_PAGE":
            return {
                ...state,
                pageNumbrer: action.payload
            }
        case "UPDATE_SEPARATE_AMOUNT":
            {
                return {
                    ...state,
                    amountSeparate: action.payload
                }
            }
        case "UPDATE_PURCHASE_AMOUNT":
            {
                return {
                    ...state,
                    amountPurchase: action.payload
                }
            }
        case "UPDATE_LIST_ITEMS":
            return {
                ...state,
                list: action.payload
            }
        case "GET_NON_WORKING_DAYS":
            return {
                ...state,
                nonWorkingDays: action.payload
            }
        case "UPDATE_IS_HISTORY":
            return {
                ...state,
                isHistory: action.payload
            }
        case "UPDATE_IS_INFORMATION":
            return {
                ...state,
                isInformation: action.payload
            }
        default:
            return state;
    }
};

export default ecommerceReducer;
