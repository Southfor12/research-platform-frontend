import request from '@/utils/request'


//动物
export function addAnimal(params) {
        return request({
                url: '/animal/pro/animal',
                method: 'post',
                data: params
        })
}
export function getAnimal(params) {
        return request({
                url: '/animal/pro/animal/page',
                method: 'get',
                params
        })
}
export function get_a_Animal(params) {
        return request({
                url: '/animal/pro/animal/' + params.id,
                method: 'get',

        })
}

export function delAnimal(params) {
        return request({
                url: '/animal/pro/animal',
                method: 'delete',
                params
        })
}

export function editAnimal(params) {
        return request({
                url: '/animal/pro/animal',
                method: 'put',
                data: params
        })
}




//物品
export function addItem(params) {
        return request({
                url: '/animal/pro/item',
                method: 'post',
                data: params
        })
}
export function getItem(params) {
        return request({
                url: '/animal/pro/item/page',
                method: 'get',
                params
        })
}
export function get_a_Item(params) {
        return request({
                url: '/animal/pro/item/' + params.id,
                method: 'get',

        })
}

export function delItem(params) {
        return request({
                url: '/animal/pro/item',
                method: 'delete',
                params
        })
}

export function editItem(params) {
        return request({
                url: '/animal/pro/item',
                method: 'put',
                data: params
        })
}





//饲养
export function addFeed(params) {
        return request({
                url: '/animal/pro/care',
                method: 'post',
                data: params
        })
}
export function getFeed(params) {
        return request({
                url: '/animal/pro/care/page',
                method: 'get',
                params
        })
}
export function get_a_Feed(params) {
        return request({
                url: '/animal/pro/care/' + params.id,
                method: 'get',

        })
}

export function delFeed(params) {
        return request({
                url: '/animal/pro/care',
                method: 'delete',
                params
        })
}

export function editFeed(params) {
        return request({
                url: '/animal/pro/care',
                method: 'put',
                data: params
        })
}





// 技术
export function addTechnical(params) {
        return request({
                url: '/animal/pro/tech',
                method: 'post',
                data: params
        })
}
export function getTechnical(params) {
        return request({
                url: '/animal/pro/tech/page',
                method: 'get',
                params
        })
}
export function get_a_Technical(params) {
        return request({
                url: '/animal/pro/tech/' + params.id,
                method: 'get',

        })
}

export function delTechnical(params) {
        return request({
                url: '/animal/pro/tech',
                method: 'delete',
                params
        })
}

export function editTechnical(params) {
        return request({
                url: '/animal/pro/tech',
                method: 'put',
                data: params
        })
}
