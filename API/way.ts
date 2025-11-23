import axios from 'axios'

import { XMLParser } from 'fast-xml-parser'
import { calculateDistance } from '../tools/maps'
import { IArea, IWay, IWayNode, IWaySegment } from '../types/types'

export async function getAreasIdsBetweenPoints(
  points: [lat: number, lng: number][],
): Promise<IArea['id'][]> {
  return [0]
}

export async function getArea(id: IArea['id']): Promise<IArea> {
  const { data } = await axios.get('/mock/agadir.json')
  return data as IArea
}

const ROADWAY_TYPES = new Set<string>([
  'motorway', 'motorway_link',
  'trunk', 'trunk_link',
  'primary', 'primary_link',
  'secondary', 'secondary_link',
  'tertiary', 'tertiary_link',
  'unclassified',
  'residential',
  'living_street',
  'service',
])

const WEIGHT_MULTIPLIERS: Record<string, number> = {
  'motorway': 1.0,
  'trunk': 1.0,
  'primary': 1.0,
  'secondary': 1.0,
  'tertiary': 1.0,
  'residential': 1.0,
  'service': 1.0,
}

export async function getAreaFromXML(id: IArea['id']): Promise<IArea> {
  const { data } = await axios.get('/mock/agadir.osm')

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  })
  const root = parser.parse(data)

  
  const nodes: Record<IWayNode['id'], IWayNode> = {}
  const xmlNodes = root.osm.node ?? []

  for (const nodeElement of xmlNodes) {
    const id = parseInt(nodeElement.id)
    nodes[id] = {
      id,
      latitude: parseFloat(nodeElement.lat),
      longitude: parseFloat(nodeElement.lon),
    }
  }


  const ways: IWay[] = []

  const xmlWays = root.osm.way ?? []

  for (const wayElement of xmlWays) {
    let skip = true
    let multiplier = 1.5
    let oneway = false
  
    const tags = Array.isArray(wayElement.tag) ? wayElement.tag : [wayElement.tag]
  
    for (const tag of tags) {
      const key = tag.k
      const value = tag.v
  
      if (key === 'highway') {
        if (ROADWAY_TYPES.has(value)) skip = false
        else break
  
        multiplier = WEIGHT_MULTIPLIERS[value] ?? 1.5
      }
  
      if (key === 'oneway') oneway = value === 'yes'
    }

    if (skip) {
      continue
    }
      
    const id = parseInt(wayElement.id)

    const segments: IWaySegment[] = []

    let prevNodeId: number | undefined

    const nds = Array.isArray(wayElement.nd) ? wayElement.nd : [wayElement.nd]

    for (const nd of nds) {
      const node1Id = prevNodeId
      const node2Id = parseInt(nd.ref)

      prevNodeId = node2Id

      const node2 = nodes[node2Id]
      if (!node1Id) {
        if (node2)
          segments.push({ nodeId: node2Id, weight: 0 })
        continue
      }

      const node1 = nodes[node1Id]
      if (!node1 || !node2)
        continue

      const weight = calculateDistance(
        [node1.latitude, node1.longitude],
        [node2.latitude, node2.longitude],
      ) * multiplier
      segments.push({ nodeId: node2Id, weight })
    }

    const way: IWay = { id, segments }
    if (oneway)
      way.oneway = oneway
    ways.push(way)
  }



  const relations = root.osm.relation ?? []

  for (const relationElement of relations) {
    const tags = Array.isArray(relationElement.tag) ? relationElement.tag : [relationElement.tag]

    let relationType: string | undefined

    for (const tag of tags) {
      const key = tag.k
      const value = tag.v
      if (key === 'type') {
        relationType = value
        break
      }
    }



    interface Members {
      from?: number,
      via?: number,
      to?: number,
    }
    const members: Members = {}




    const membersRaw = Array.isArray(relationElement.member)
    ? relationElement.member
    : [relationElement.member]


    for (const member of membersRaw) {
      const role = member.role
      const ref = parseInt(member.ref)

      if (['from', 'via', 'to'].includes(role))
        members[role as keyof Members] = ref
    }

    if (members.from && members.via && members.to && members.via in nodes) {
      const node = nodes[members.via]
      if (!node.turnRestrictions)
        node.turnRestrictions = []
      node.turnRestrictions!
        .push({ fromWayId: members.from, toWayId: members.to })
    }
  }

  const resultNodes = new Set<IWayNode>()
  for (const way of ways)
    for (const segment of way.segments)
      if (segment.nodeId in nodes)
        resultNodes.add(nodes[segment.nodeId])

  return { id, nodes: [...resultNodes], ways }
}