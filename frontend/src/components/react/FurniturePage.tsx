import '@/assets/css/product.css'
import { useState, useEffect, useRef } from 'react';
import { debounce } from './debounce'; // Adjust the import path as needed
import type { FurniturePageProps, Category, GetFurnitureParams, Furniture, GetFurnitureResponse, OnEventData} from '@/components/react/interfaces';
import FurnitureCard from './FurnitureCard';
import Pagination from './Pagination';

export default function FurniturePage({ baseApiUrl }: FurniturePageProps) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [inStockOption, setInStockOption] = useState(false);
    const [selectedPageSize, setSelectedPageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [queryParamObj, setQueryParamObj] = useState<GetFurnitureParams>({});
    const [furnitures, setFurnitures] = useState<Furniture[]>([]);
    const [currentExpanded, setCurrentExpanded] = useState<OnEventData>({id: -1, value: false});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        fetchCategories();
    }, []) ;

    const fetchCategories = async () => {
        const response = await fetch(`${baseApiUrl}category`, {
            method: 'GET', // or 'POST', 'PUT', etc., depending on your needs
            headers: {
                'Origin': 'https://serviciosmultiples.pro', // Set the Origin header here
            }
        });
        const data = await response.json();
       setCategories(data);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const categoryId = parseInt((event.target as HTMLInputElement).id.replace('category', ''), 10);
        if ((event.target as HTMLInputElement).checked) {
            // Add categoryId to selectedCategories
            setSelectedCategories(prevSelected => [...prevSelected, categoryId]);
        } else {
            // Remove categoryId from selectedCategories
            setSelectedCategories(prevSelected => prevSelected.filter(id => id !== categoryId));
        }
    };

    useEffect(() => {
        setQueryParamObj(prevState => ({
            ...prevState,
            categoryIds: selectedCategories,
            pageNumber: 1
        }))
    }, [selectedCategories]);


    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInStockOption((event.target as HTMLInputElement).value === 'true'); // Convert string to boolean
    };

    useEffect(() => {
        setQueryParamObj(prevState => ({
            ...prevState,
            inStock: inStockOption,
            pageNumber: 1
        }))
    }, [inStockOption]);

    const handlePriceFilter = () => {
        const minPriceValue = (document.getElementById('minPrice') as HTMLInputElement).value
        const maxPriceValue = (document.getElementById('maxPrice') as HTMLInputElement).value

        if(minPriceValue == '' || maxPriceValue == ''){
            alert('Ambos campos deben tener un número válido')
            setQueryParamObj(prevState => ({
                ...prevState,
                minPrice: 0,
                maxPrice: 0,
                pageNumber: 1
            }))
            return;
        }

        const minPriceValueNum = parseInt((document.getElementById('minPrice') as HTMLInputElement).value, 10)
        const maxPriceValueNum = parseInt((document.getElementById('maxPrice') as HTMLInputElement).value, 10)

        if(minPriceValueNum <= 0 || minPriceValueNum <= 0){
            alert('Precio Máximo y Precio Mínimo deben ser mayores que cero')
            return;
        }

        if(minPriceValueNum >= maxPriceValueNum){
            alert('Precio máximo debe ser mayor que Precio Mínimo')
            return;
        }

        setQueryParamObj(prevState => ({
            ...prevState,
            minPrice: minPriceValueNum,
            maxPrice: maxPriceValueNum,
            pageNumber: 1
        }))
    }

    useEffect(() => {
        setQueryParamObj(prevState => ({
            ...prevState,
            pageSize: selectedPageSize,
            pageNumber: 1
        }))
    }, [selectedPageSize]);

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPageSize(parseInt((event.target as HTMLSelectElement).value, 10)); // Convert string to number
    };

    const searchDebounce = useRef(debounce((value: string) => {
        setQueryParamObj(prevState => ({
            ...prevState,
            search: value,
            pageNumber: 1
        }))        
    }, 1500)).current; // 2 seconds debounce delay

    useEffect(() => {
        searchDebounce(searchValue);
    }, [searchValue]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue((event.target as unknown as HTMLInputElement).value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            // Immediately fetch data when Enter key is pressed
            event.preventDefault();
            searchDebounce.flush();
            setDebouncedSearchValue(searchValue); // Force fetch
        }
    };

    const handleSearchClick = () => {
        searchDebounce.flush();
        setDebouncedSearchValue(searchValue)
    }

    useEffect(() => {
        // Fetch data immediately if debouncedSearchValue is updated
        setQueryParamObj(prevState => ({
            ...prevState,
            search: debouncedSearchValue,
            pageNumber: 1
        }))  
    }, [debouncedSearchValue]);

    const startingWithQuestionMark = (text:string) => {
        return text.includes('?') ? '&' : '?';
    }

    const triggerRequest = async (fullUrl: string) => {
        await fetch(fullUrl, {
            method: 'GET', // or 'POST', 'PUT', etc., depending on your needs
            headers: {
                'Origin': 'https://serviciosmultiples.pro', // Set the Origin header here
            }
          })
            .then((res) => res.json()) // Parse response as JSON
            .then((data: GetFurnitureResponse) => {                
                setFurnitures(data.items); // Now data is of type Funiture[]
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        let baseGetRequest = `${baseApiUrl}furniture`

        if(queryParamObj.search){
            baseGetRequest += `?search=${queryParamObj.search}`
        }

        if(queryParamObj.categoryIds && queryParamObj.categoryIds.length > 0){
            queryParamObj.categoryIds.forEach((id: number) => {
                baseGetRequest += startingWithQuestionMark(baseGetRequest) + `CategoryIds=${id}`
            })
        }

        if(queryParamObj.minPrice && queryParamObj.maxPrice){
            baseGetRequest += startingWithQuestionMark(baseGetRequest) + `MinPrice=${queryParamObj.minPrice}&MaxPrice=${queryParamObj.maxPrice}`
        }

        if(queryParamObj.inStock){
            baseGetRequest += startingWithQuestionMark(baseGetRequest) + `InStock=${queryParamObj.inStock}`
        }

        if(queryParamObj.pageNumber){
            baseGetRequest += startingWithQuestionMark(baseGetRequest) + `PageNumber=${queryParamObj.pageNumber}`
        }

        if(queryParamObj.pageSize){
            baseGetRequest += startingWithQuestionMark(baseGetRequest) + `PageSize=${queryParamObj.pageSize}`
        }

        triggerRequest(baseGetRequest)
        
    }, [queryParamObj]);

    const onExpandEvent = (eventData: OnEventData) => {
        setCurrentExpanded(eventData)
    };

    const onPageChange = (page: number) => {
        setQueryParamObj(prevState => ({
            ...prevState,
            pageNumber: page
        })) 
    };

    return (
        <main className="w-full flex flex-row flex-nowrap justify-between md:px-3 mt-20 lg:mt-24 mb-14">

            <section className="w-[39%] md:w-[24%] flex flex-col filters">

                <h1 className='text-background-footer text-lg font-bold merry tracking-wider mb-1'>Categorías</h1>
                <section className='flex flex-row flex-wrap gap-2 mb-5'>
                {categories.map((category: Category)  => (
                    <div key={category.id} className='flex flex-row gap-x-5 w-[48%] items-center'>
                        <div className="custom-checkbox-container">
                            <label className="container">
                                <input type="checkbox" id={`category${category.id}`} onChange={handleCheckboxChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <label
                        className="cursor-pointer font-bold text-primary text-xs md:text-sm xl:text-base pb-1" htmlFor={`category${category.id}`}>
                        {category.name}
                        </label>
                    </div>
                ))} 
                </section>


                <h1 className='text-background-footer text-lg font-bold merry tracking-wider mb-5'>Mostrar solo en stock</h1>
                <section className='flex flex-row gap-x-4 mb-3'>
                    <div>
                        <input type="radio" id="inStockYes" name="inStockOptions" value="true" 
                        className='accent-brand-secondary' checked={inStockOption === true} onChange={handleStockChange}/>
                        <label htmlFor="inStockYes" className='pb-1 cursor-pointer font-bold text-primary ml-0.5'>Sí</label>
                    </div>

                    <div>
                        <input type="radio" id="inStockNo" name="inStockOptions" value="false"
                        className='accent-brand-secondary' checked={inStockOption === false} onChange={handleStockChange}/>
                        <label htmlFor="inStockNo" className='pb-1 cursor-pointer font-bold text-primary ml-0.5'>No</label>
                    </div>
                </section>


                <h1 className='text-background-footer text-lg font-bold merry tracking-wider mb-1'>Rango de precios</h1>
                
                <div className='flex flex-col'>
                    <div className='flex flex-col xl:flex-row'>
                        <div className='w-full xl:w-[40%] flex flex-col'>
                            <label htmlFor="minPrice" className='break-words cursor-pointer font-bold text-primary'>Precio Mínimo</label>
                            <input type="number" id="minPrice" name="minPrice" className='border-brand-secondary border rounded-md w-[49%] edit-input-number' placeholder='E.g. 1000'/>
                        </div>

                        <div className='w-full xl:w-[40%] flex flex-col'>
                            <label htmlFor="maxPrice" className='break-words cursor-pointer font-bold text-primary'>Precio máximo</label>
                            <input type="number" id="maxPrice" name="maxPrice" className='border-brand-secondary border rounded-md w-[49%] edit-input-number' placeholder='E.g. 2000'/>
                        </div>
                    </div>
                    <button className='bg-primary text-brand w-11/12 max-w-[189px] xl:w-2/5 text-sm xl:text-base mt-3 p-1 rounded-md break-words' onClick={handlePriceFilter}>Filtrar por precios</button>
                </div>
            </section>


            <section className='w-3/5 md:w-9/12 flex flex-col gap-y-4'>
                <section className='w-full flex flex-col gap-y-3 xl:flex-row xl:flex-nowrap xl:justify-between'>
                    <section className='w-[14%] flex flex-row flex-nowrap items-center gap-x-1'>
                        <label htmlFor="selectPageSize" className='cursor-pointer font-bold text-primary'>
                            Productos
                        </label>
                        <select 
                            id="selectPageSize" 
                            value={selectedPageSize} 
                            onChange={handlePageSizeChange} 
                            className='border rounded p-2 h-full'
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </section>

                    <section className='w-[84%] flex flex-row flex-nowrap items-center gap-x-2 h-10'>
                        <label htmlFor="searchBar" className='break-words cursor-pointer font-bold text-primary' onClick={handleSearchClick}>Buscar</label>
                        <input type="text" id="searchBar" name="searchBar" className='search-bar border-brand-secondary border rounded-md w-4/5 h-full'
                        placeholder='E.g. escritorio de melamina' value={searchValue} onChange={handleSearchChange} onKeyDown={handleKeyDown}/>
                    </section>
                </section>

                
                {
                    // Furniture List Section
                    furnitures.length === 0 ? (
                        <p>No hay producto disponible</p> // Show if furnitures array is empty
                    ) : 
                    (
                        <section className='w-full flex flex-col md:flex-row md:flex-wrap gap-x-[1.8%] lg:gap-x-[3%] gap-y-4'>
                        {furnitures.map((furniture) => (
                            <FurnitureCard key={furniture.id} item={furniture} isExpanded={!currentExpanded.value ? currentExpanded.id === furniture.id : false} onExpandEvent={onExpandEvent}/>
                        ))}
                        </section>
                    )
                }
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>
            </section>

        </main>
    );
};
