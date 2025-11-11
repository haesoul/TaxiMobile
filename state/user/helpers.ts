import * as API from './../../API'

            
export async function uploadFiles(data: any) {
    const filesMap: Record<string, any[]> = data.files
    const additionalDetails: any = data.u_details
    const params: any = data.tokens

    const uploadGroupPromises = Object.keys(filesMap)
        .filter(key => Array.isArray(filesMap[key]))
        .map(async (key) => { 
            const filesToUpload = filesMap[key]
                .filter((item: [any, any]) => !item[0])
                .map((item: [any, any]) => item[1])

            const uploadFilePromises = filesToUpload.map((file: any) => {
                const form = new FormData()
                form.append("file", {
                    uri: file.uri,
                    name: file.name || `file_${Date.now()}`,
                    type: file.type || "application/octet-stream",
                } as any)

                Object.keys(params).forEach(paramKey => form.append(paramKey, params[paramKey]))
                
                return API.uploadFile(form)
            })
            
            const results = await Promise.all(uploadFilePromises)
            
            const dlIds = results.reduce<string[]>((acc, item: any) => {

              const dlId = item?.data?.data?.dl_id; 
                
                return (dlId) ? [...acc, dlId] : acc
            }, []);

            return { [key]: JSON.stringify(dlIds) }
        })

    const uploadResults = await Promise.all(uploadGroupPromises) 

    const u_details = uploadResults.reduce((acc, item) => ({ ...acc, ...item }), additionalDetails)
    
    return await API.editUserAfterRegister({
        u_details,
        u_id: `${params?.u_id}`,
        token: params?.token,
        u_hash: params?.u_hash
    })
}


export async function uploadRegisterFiles(params: any) {
    const { filesToUpload, response, u_details } = params
    const uploadsName: string[] = []
    
    const uploadFilePromises = filesToUpload
        .filter((item: any) => item.file)
        .map((item: any) => {
            uploadsName.push(item.name)
            
            const form = new FormData()
            form.append("file", {
                uri: item.file.uri,
                name: item.file.name || `file_${Date.now()}`,
                type: item.file.type || "application/octet-stream",
            } as any)

            Object.keys(response).forEach(paramKey => form.append(paramKey, response[paramKey]))

            return API.uploadFile(form)
        })
        
    const results: any[] = await Promise.all(uploadFilePromises)

    const userData: Record<string, any> = {}

    results.forEach((item, i) => {
        const resData = item.data || {}
        if (resData.status !== 'success') return
        
        const fileId = resData.data?.dl_id
        const name = uploadsName[i]

        userData[name] = (userData[name] || []).concat(fileId)
    })

    Object.keys(userData).forEach(key => {
        userData[key] = JSON.stringify(userData[key])
    })

    if (u_details) {
        Object.keys(u_details).forEach(key => {
            userData[key] = u_details[key]
        })
    }

    return await API.editUserAfterRegister({
        u_details: userData,
        u_id: `${response?.u_id}`,
        token: response?.token,
        u_hash: response?.u_hash
    })
}