import type { Camp } from '@/models/types'

export const CAMPS: Camp[] = [
  {
    id: 'camp1', name: '2900营地', segmentId: 1,
    waterRefill: { summer: 1, winterWithStove: 1, winterWithoutStove: 0.5 },
    description: '松树林中的一小片平地，有前人搭建的简易石灶。',
  },
  {
    id: 'camp2', name: '水窝子营地', segmentId: 3,
    waterRefill: { summer: 1, winterWithStove: 1, winterWithoutStove: 0.5 },
    description: '麦秸岭下方的一处水源地，夏季有溪流经过。',
  },
  {
    id: 'camp3', name: '2800营地', segmentId: 5,
    waterRefill: { summer: 1, winterWithStove: 1, winterWithoutStove: 0.5 },
    description: '鳌太线的中间点。很多人在这里做出决定：继续，还是下撤。',
  },
  {
    id: 'camp4', name: '大爷海', segmentId: 9,
    waterRefill: { summer: 1, winterWithStove: 1, winterWithoutStove: 0.5 },
    description: '海拔3600米的高山湖泊，有太白山保护站的板房。最后的补给点。',
  },
]

export function getCampForSegment(segmentId: number): Camp | undefined {
  return CAMPS.find(c => c.segmentId === segmentId)
}
