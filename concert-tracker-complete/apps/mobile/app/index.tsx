import { useEffect, useState } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase-client'

export default function Home(){
  const [shows, setShows] = useState<any[]>([])
  useEffect(()=>{(async()=>{
    const { data } = await supabase.from('shows').select('*').eq('status','Planned').order('start_at')
    setShows(data ?? [])
  })()},[])
  return (
    <View style={{ padding: 16 }}>
      <FlatList data={shows} keyExtractor={i=>i.id}
        renderItem={({item})=> (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.artist}</Text>
            <Text>{new Date(item.start_at).toLocaleString()}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={{ padding:12, borderRadius:12, borderWidth:1 }}>
        <Text>Add Show</Text>
      </TouchableOpacity>
    </View>
  )
}
