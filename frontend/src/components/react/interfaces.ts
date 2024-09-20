export interface GetFurnitureParams{
    search?: string,
    categoryIds?: Array<number>
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    pageNumber?: number
    pageSize?: number
}

export interface Furniture{
    id: number
    productId: string
    name: string
    description: string
    images: string
    categoryName: string
    price?: number
    quantity: number
}

export interface FurniturePageProps{
    baseApiUrl: string
}

export interface OnEventData{
    id: number
    value: boolean
}

export interface FurnitureCardProps{
    item: Furniture
    isExpanded: boolean
    onExpandEvent: Function
}

export interface Category{
    id: number
    name: string
}

export interface GetFurnitureResponse{
    currentPage: number
    totalCount: number
    totalPages: number
    items: Furniture[]
}

export interface PaginationProps{
    totalPages: number
    currentPage: number
    onPageChange: Function
}

export interface Testimonial{
    name: string
    text: string
    photo: string
    position: string
    company: string
    src?: string
    index?: number
}

export interface TestimonialsProps{
    title: string
    testimonials: Array<Testimonial>
}

export interface ImageModule{
    default: any
}

export interface IconProps{
    width: string
    height: string
    color?: string
}