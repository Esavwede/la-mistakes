/************** CONFIGURATION FILES HERE ********************** */


class CollectionGetter
{
    constructor()
    {
        this.collections = []
    }

    msg()
    {
        console.log(chalk.blue('enter the names of the collections into an array'))
    }

    pullCollections(collections)
    {
        for(let i = 0; i < collections.length; i++)
        {
            this.collections[i] = collections[i]
        }
    }

    pushCollections(collections)
    {
        for(let i = 0; i < collections.length; i++)
        {
            this.collections[i] = collections[i]
        }
    }
}



const collectionGetter = new CollectionGetter()
collectionGetter.msg()
collectionGetter.pullCollections('array of collection names ')



module.exports = 
{
    databaseName: laMistakes,
    collections: collectionGetter.pushCollections()
}