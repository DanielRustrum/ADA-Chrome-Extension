import './App.scss'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { ImageTextTab } from './components/tabs/analyze-image'
import icon from '../public/icon.svg'


function App() {
    return (
        <div className='flex flex-col items-center gap-10 mx-10 py-5'>
            <div className='flex gap-10 items-center'>
                <img src={icon} className='w-12 h-12 mt-1'/>
                <h1>Text Contrast Checker</h1>
            </div>
            <p>
                Analyze the contrast ratio between text and the medium that surrounds it to see if the text would passed WCAG Contrast ratio guidelines. 
                Be warn these algorithms are computationally heavy and may take a while to run.
            </p>
            <Tabs defaultValue="analyze-image" className="w-fit">
                <TabsList className="flex justify-center">
                    <TabsTrigger value="analyze-color" className='text-white data-[state=active]:text-amber-500'>Analyze Color</TabsTrigger>
                    <TabsTrigger value="analyze-image" className='text-white data-[state=active]:text-amber-500'>Analyze Image</TabsTrigger>
                    <TabsTrigger value="analyze-video" className='text-white data-[state=active]:text-amber-500'>Analyze Video</TabsTrigger>
                    <TabsTrigger value="analyze-page" className='text-white data-[state=active]:text-amber-500'>Analyze Webpage</TabsTrigger>
                </TabsList>
                <TabsContent value="analyze-color">This Feature has Yet to be Implemented</TabsContent>
                <TabsContent value="analyze-image"><ImageTextTab /></TabsContent>
                <TabsContent value="analyze-video">This Feature has Yet to be Implemented</TabsContent>
                <TabsContent value="analyze-page">This Feature has Yet to be Implemented</TabsContent>
            </Tabs>
        </div>
    )
}

export default App
