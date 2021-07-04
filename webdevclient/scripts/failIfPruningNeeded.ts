import { getPruneInfo, printPruneInfo } from './tsPruneUtils'

const pruneInfo = getPruneInfo()
printPruneInfo(pruneInfo)
if (pruneInfo.modulesThatNeedPruning.length > 0) {
  throw new Error('There are modules that need pruning!')
}
