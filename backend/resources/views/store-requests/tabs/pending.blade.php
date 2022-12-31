<div class="tab-pane fade show active" id="pending-tab-pane" role="tabpanel" aria-labelledby="pending-tab" tabindex="0">
    @if(count($stores['pending']) <= 0) <div class="d-flex justify-content-between p-3">
        nothing to show
</div>
@else
@foreach($stores['pending'] as $index => $store)
<div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
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
            <form class="mt-auto mb-3" action="{{route('organiser.store-request.approve')}}" method="POST">
                @csrf
                <input type="hidden" name="store_id" value="{{ $store->id }}" required>
                <button type="submit" class="btn btn-theme w-full px-4">Approve</button>
            </form>

            <button type="button" class="btn btn-theme-warning w-full px-4 mb-auto" data-bs-toggle="modal" data-bs-target="#exampleModal">Deny</button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

                <form action="{{route('organiser.store-request.deny')}}" method="POST">
                    @csrf
                    <input type="hidden" name="store_id" value="{{ $store->id }}" required>
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <p>Deny reasons:</p>
                                <textarea class="form-control" name="deny_reason" id="floatingTextarea"></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-theme-warning px-4">Deny</button>
                                <button type="button" class="btn btn-theme-cancel px-4" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </div>

</div>
@endforeach
@endif
</div>