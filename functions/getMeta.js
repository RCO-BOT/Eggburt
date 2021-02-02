const services = new (require(`elara-services`))(process.env.ELARA_API_KEY),
      { api: { platform }} = services;

const getMetaData =  ( async (link) => {
    
    // Extract YouTube video ID from YouTube link
    if (!link.match(/http(s)?:\/\//)) link = `https://${link}`
    const id = link.replace(/http(s)?:\/\/(m.|www.)?youtube.com\/watch\?v=/i, "")

    // Get video meta
    let getVidData = await services.api.platform.ytsearch(process.env.YOUTUBE_API_KEY, id)
    let vidData = getVidData.list[0]

    return vidData
})

module.exports = {
    getMetaData
}