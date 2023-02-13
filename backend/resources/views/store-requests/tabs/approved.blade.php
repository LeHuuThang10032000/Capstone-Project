<div class="tab-pane fade" id="approved-tab-pane" role="tabpanel" aria-labelledby="approved-tab" tabindex="0">
    @if(count($stores['approved']) <= 0) <div class="d-flex justify-content-between p-3">
        Không có đơn yêu cầu đã chấp thuận nào
</div>
@else
@foreach($stores['approved'] as $index => $store)
<div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
    <div class="d-flex justify-content-between rounded border">
        <div class="p-3">
            <p class="m-0">Tên: {{$store->name}}</p>
            <p class="m-0">Sản phẩm kinh doanh: {{$store->selling_products}}</p>
            <p class="m-0">Vị trí: {{$store->location}}</p>
            <p class="m-0">Số điện thoại: {{$store->phone}}</p>
            <p class="m-0">Email: {{ ($store->email) ?? 'null' }}</p>
            <p class="m-0">Thời gian gửi yêu cầu: {{$store->created_at}}</p>
            <p class="m-0" style="color: #189F7F">Chấp thuận</p>
        </div>
    </div>
</div>
@endforeach
<div class="py-2 px-3">
    {{ $stores['approved']->links() }}
</div>
@endif
</div>