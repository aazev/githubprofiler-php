@extends('base')

@section('content')
    <div class="grid grid-cols-1 place-content-center place-items-center h-full space-y-8" data-role="profilerUi" data-username='{{ $profile }}'></div>
@endsection

@once
    @push('js')
        <script src="{{ mix('js/ProfilerUi.js') }}"></script>
    @endpush
@endonce
