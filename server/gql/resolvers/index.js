import queryResolvers from './query/queryResolvers'
import mutationResolvers from './mutation/mutationResolvers'
import unionResolvers from './union/unionResolvers'
const AllResolvers = { ...queryResolvers, ...mutationResolvers, ...unionResolvers }
export default AllResolvers
