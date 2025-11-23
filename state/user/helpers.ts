import * as API from './../../API'



export async function uploadFiles(data: any) {
  const filesMap: Record<string, any[]> = data.files
  const additionalDetails: any = data.u_details
  const params: any = data.tokens

  const uploads = Object.keys(filesMap)
    .filter(key => Array.isArray(filesMap[key]))
    .map(async key => {
      const files = filesMap[key]
        // item = [something, fileObject]
        .filter((item: [any, any]) => !item[0])
        .map((item: [any, any]) => item[1])

      const promises = files.map((file: any) => {
        return API.uploadFile({
          file: {
            uri: file.uri,
            name: file.name,
            type: file.type,
          },
          ...params,
        })
      })

      const uploaded: any[] = await Promise.all(promises)

      const ids = uploaded.map(r => r.data?.data?.dl_id)

      return { [key]: JSON.stringify(ids) }
    })

  const applied = await Promise.all(uploads)

  const u_details = applied
    .reduce((acc, item) => ({ ...acc, ...item }), additionalDetails)

  return API.editUserAfterRegister({
    u_details,
    u_id: `${params?.u_id}`,
    token: params?.token,
    u_hash: params?.u_hash,
  })
}

export async function uploadRegisterFiles(params: any) {
  const { filesToUpload, response, u_details } = params

  const uploadsName: string[] = []

  const uploads = filesToUpload
    .filter((item: any) => item.file)
    .map((item: any) => {
      uploadsName.push(item.name)
      return API.uploadFile({
        file: {
          uri: item.file.uri,
          name: item.file.name,
          type: item.file.type,
        },
        ...response,
      })
    })

  const res = await Promise.all(uploads)

  const userData: Record<string, any> = {}

  // res.forEach((item, i) => {
  //   const resData = item.data || {}
  //   if (resData.status !== 'success') return
  //   const fileId = resData.data?.dl_id
  //   userData[uploadsName[i]] = [fileId]
  // })
  res.forEach((item, i) => {
        const resData = item.data || {}
        if (resData.status !== 'success') return
        const fileId = resData.data?.dl_id
        userData[uploadsName[i]] = (userData[uploadsName[i]] || []).concat(fileId) 
    })

  // stringifying arrays
  Object.keys(userData).forEach(key => {
    userData[key] = JSON.stringify(userData[key])
  })

  if (u_details) {
    Object.assign(userData, u_details)
  }

  return API.editUserAfterRegister({
    u_details: userData,
    u_id: `${response?.u_id}`,
    token: response?.token,
    u_hash: response?.u_hash,
  })
}

