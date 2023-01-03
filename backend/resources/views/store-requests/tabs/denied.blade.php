<div class="tab-pane fade" id="denied-tab-pane" role="tabpanel" aria-labelledby="denied-tab" tabindex="0">
    @if(count($stores['denied']) <= 0)
    <div class="d-flex justify-content-between p-3">
        Không có đơn yêu cầu đã từ chối nào
    </div>
    @else
    @foreach($stores['denied'] as $index => $store)
    <div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3 ">
        <div class="d-flex justify-content-between rounded border">
            <div class="p-3">
                <p class="m-0">tên: {{$store->name}}</p>
                <p class="m-0">sản phẩm kinh doanh: {{$store->selling_products}}</p>
                <p class="m-0">vị trí: {{$store->location}}</p>
                <p class="m-0">số điện thoại: {{$store->phone}}</p>
                <p class="m-0">email: {{ ($store->email) ?? 'null' }}</p>
                <p class="m-0">thời gian gửi yêu cầu: {{$store->created_at}}</p>
                <p class="m-0" style="color: #E76969">{{$store->status}}</p>
            </div>
        </div>
    </div>
    @endforeach
    @endif
</div>