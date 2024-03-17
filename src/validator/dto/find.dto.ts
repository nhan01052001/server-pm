export class FindDTO {
    findByPrice?: {
        fromPrice?: number | null,
        toPrice?: number | null,
    }

    findByDateEnd?: {
        fromDate?: Date | null,
        toDate?: Date | null,
    }

    type?: {
        value?: string | null
    }

    quantity?: {
        value?: number | null
    }
}