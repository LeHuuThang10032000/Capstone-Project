<div class="tab-pane fade show active" id="pending-tab-pane" role="tabpanel" aria-labelledby="pending-tab" tabindex="0">
    @if($stores['pending']->count() <= 0)
    <div class="d-flex justify-content-between p-3">
        nothing to show
    </div>
    @else
    @foreach($stores['pending'] as $store)
    <div class="py-2 px-3">
        <div class="d-flex justify-content-between rounded border">
            <div class="p-3">
                <p class="m-0">name: {{$store->name}}</p>
                <p class="m-0">selling products: {{$store->selling_products}}</p>
                <p class="m-0">location: {{$store->location}}</p>
                <p class="m-0">phone: {{$store->phone}}</p>
                <p class="m-0">email: {{ ($store->email) ?? 'null' }}</p>
                <p class="m-0">request time: {{$store->created_at}}</p>
                <p class="m-0" style="color: #FF9900">{{$store->status}}</p>
            </div>
            <div class="d-flex flex-column py-3 px-4">
                <button class="btn btn-theme mt-auto mb-3 px-3">approve</button>
                <button class="btn btn-theme-warning mb-auto px-3">deny</button>
            </div>
        </div>
        
    </div>
    @endforeach
    @endif
    
</div>