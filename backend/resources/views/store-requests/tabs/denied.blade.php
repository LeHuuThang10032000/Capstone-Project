<div class="tab-pane fade" id="denied-tab-pane" role="tabpanel" aria-labelledby="denied-tab" tabindex="0">
    @if(count($stores['denied']) <= 0)
    <div class="d-flex justify-content-between p-3">
        nothing to show
    </div>
    @else
    @foreach($stores['denied'] as $index => $store)
    <div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3 ">
        <div class="d-flex justify-content-between rounded border">
            <div class="p-3">
                <p class="m-0">name: {{$store->name}}</p>
                <p class="m-0">selling products: {{$store->selling_products}}</p>
                <p class="m-0">location: {{$store->location}}</p>
                <p class="m-0">phone: {{$store->phone}}</p>
                <p class="m-0">email: {{ ($store->email) ?? 'null' }}</p>
                <p class="m-0">request time: {{$store->created_at}}</p>
                <p class="m-0" style="color: #E76969">{{$store->status}}</p>
            </div>
        </div>
    </div>
    @endforeach
    @endif
</div>